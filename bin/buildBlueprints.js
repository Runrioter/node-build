#!/usr/bin/env node
const path = require('path');
const _ = require('lodash');
const yargs = require('yargs');
const Mocha = require('mocha');
const colors = require('colors');
const rimraf = require('rimraf');
const mochaNotifier = require('mocha-notifier-reporter');

const build = require('../lib/build');
const makeBuild = require('../lib/makeBuild').makeBuild;
const configs = require('../lib/configs');
const getWebpackEntryForTest = require('../lib/getWebpackEntryForTest');
const uploadToSentry = require('../lib/uploadToSentry');

const argv = yargs
  .alias('b', 'blueprintsPath')
  .describe('b', 'path to a raw-config via a node file with module.exports = config')
  .default('b', './blueprints.config.js')
  .alias('p', 'production')
  .describe('p', 'enable production settings for the default build configs')
  .default('p', false)
  .alias('c', 'client')
  .describe('c', 'use the default client build, assumes you have an entry point to a client at ~/lib/client.[es6.js|js|jsx]')
  .default('c', false)
  .alias('s', 'server')
  .describe('s', 'use the default server build, assumes you have an entry point to a server at ~/lib/server.[es6.js|js|jsx]')
  .default('s', false)
  .alias('a', 'clientAndServer')
  .describe('a', 'use both a client and a server build. checks if you have an extend build and applies it.')
  .default('a', true)
  .alias('w', 'watch')
  .describe('w', 'force watching of all builds')
  .default('w', false)
  .alias('i', 'ignoreBlueprints')
  .describe('i', 'ignore the blueprints.config.js file in the current directory and use defaults')
  .default('i', false)
  .alias('t', 'runTest')
  .describe('t', 'search for test files and run them')
  .default('t', false)
  .help()
  .alias('h', 'help')
  .version()
  .wrap(yargs.terminalWidth())
  .argv;

function loadBlueprintsFromPath(filePath, isProduction) {
  try {
    filePath = path.resolve(filePath);
    console.log(colors.green('[Loading blueprints from]'), filePath);
    let builds = require(filePath);

    // build configuration files are written in js and can be:
    //   a) a function that takes isProduction (boolean) and returns an array of builds
    //   b) object with property named extensions, to extend / override default builds
    //   c) an array of builds
    // The array is most straightforward and the function seems infinitely
    // more useful than the extensions object, and easier to understand. I'd
    // like to deprecate the extensions object if its not being used in many places.
    if (typeof builds === 'function') {
      builds = builds(isProduction);
    } else if (!Array.isArray(builds)) {
      if (builds.extensions === true) {
        return { extensions: _.omit(builds, 'extensions') };
      }
      builds = [builds];
    }

    return { builds };
  } catch (e) {
    console.log(colors.red('Error in loading blueprints: '), e.message);
    process.exit(1);
  }
}

function loadDefaultConfigs(options) {
  console.log(colors.green('[Using default configs]'));
  if (options.runTest) {
    console.log(colors.green('[Setting up tests:]'));
    const config = _.merge(
      {},
      configs.getDefaultTestingConfig(),
      { webpack: { entry: getWebpackEntryForTest('./') } }
    );
    return [ config ];

  } else if (options.client) {
    console.log(colors.green('[client config]'));
    return [ configs.getClientConfig(options.production) ];

  } else if (options.server) {
    console.log(colors.green('[server config]'));
    return [ configs.getServerConfig(options.production) ];

  } else if (options.clientAndServer) {
    console.log(colors.green('[both client and server config]'));
    return [
      configs.getClientConfig(options.production),
      configs.getServerConfig(options.production),
    ];
  }
}


function makeConfig(options) {
  let builds;
  let extensions = {};

  if (options.blueprintsPath && !options.ignoreBlueprints && !options.runTest) {
    const blueprints = loadBlueprintsFromPath(options.blueprintsPath, options.production);

    if (blueprints.extensions) {
      extensions = blueprints.extensions;

    } else if (blueprints.builds && blueprints.builds.length) {
      builds = blueprints.builds;
    }
  }

  if (!builds) {
    builds = loadDefaultConfigs(options);
  }

  if (options.watch) {
    extensions.watch = true;
  }

  return builds.reduce(function(namedBuilds, build) {
    namedBuilds[build.name] = makeBuild(_.merge(build, extensions));
    return namedBuilds;
  }, {});
}

function shouldUploadToSentry(sentryProject, buildName) {
  return (
    sentryProject &&
    argv.production &&
    WHITELISTED_BUILD_NAMES.indexOf(buildName) > -1 &&
    process.env.SENTRY_KEY &&
    process.env.SENTRY_RELEASE_BASE_URL
  );
}

console.log(colors.green('[Reading Blueprints]'), argv.blueprintsPath);
console.log(colors.green('[Current Working Directory]'), process.cwd());

const config = makeConfig(argv);

const JS_REGEX = /.*\.js(\.map)?$/;
// sentry does not currently support source maps for the server
// so there is no point add server builds here.
// see: https://github.com/getsentry/sentry/issues/2632
const WHITELISTED_BUILD_NAMES = ['ProductionClient'];

build(config, function(buildName, stats) {
  if (stats.errors && stats.errors.length > 0 && !argv.watch) {
    console.log(colors.red('ERROR IN BUILD. Aborting.'));
    process.exit(1);
  }

  // upload to Sentry if applicable
  const build = config[buildName];
  if (shouldUploadToSentry(build.sentryProject, buildName)) {
    const buildPath = build.webpackConfig.output.path;
    const assets = stats.assets
      .filter(function(a) { return JS_REGEX.test(a.name); })
      .map(function(a) { return path.join(buildPath, a.name); });

    uploadToSentry(build.sentryProject, build.sentryOrg, build.release, assets);
  }

  if (argv.runTest) {
    console.log(colors.magenta(
      '\n   ******************************' +
      '\n   *       RUNNING TESTS        *' +
      '\n   ******************************'
    ));

    const m = new Mocha({ reporter: mochaNotifier.decorate('spec') });
    stats.assets.forEach(function(asset) {
      m.addFile(`./.test/${asset.name}`);
    });
    m.run();

    // we want to remove these from the require cache while we have path
    // references to them to ensure they get tested on the next rebuild
    m.files.forEach(function(filePath) {
      delete require.cache[require.resolve(path.resolve(filePath))];
    });
  }
});

// Hacky way to handle webpacks file output
process.on('SIGINT', function() {
  if (argv.runTest) {
    const testDirectory = configs.getDefaultTestingConfig().webpack.output.path;
    rimraf(path.resolve(testDirectory), {}, process.exit);
  } else {
    process.exit();
  }
});
