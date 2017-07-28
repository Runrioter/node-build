const _ = require('lodash');
const tryToLoadGenerator = require('../tryToLoadGenerator').tryToLoadGenerator;

const ContentHashOutput = require('./ContentHashOutput');
const SimpleOutput = require('./SimpleOutput');
const LibraryOutput = require('./LibraryOutput');

function libraryOfTarget(target) {
  return function(options) {
    return LibraryOutput(_.extend(options, {
      target,
    }));
  };
}

const outputs = {
  contenthash: ContentHashOutput, // this uses chunk hash should you probably
  // only use it in production for long-lived files that need cache-busting
  simple: SimpleOutput,
  library: LibraryOutput,
  this: libraryOfTarget('this'),
  commonjs: libraryOfTarget('commonjs'),
  commonjs2: libraryOfTarget('commonjs2'),
  amd: libraryOfTarget('amd'),
  umd: libraryOfTarget('umd'),
};

const getOutput = function(outputName) {
  return tryToLoadGenerator(outputName, outputs, 'output');
};

module.exports = {
  outputs,
  getOutput,
};
