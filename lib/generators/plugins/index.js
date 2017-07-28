const tryToLoadGenerator = require('../tryToLoadGenerator').tryToLoadGenerator;
const AbortIfErrorsPlugin = require('./AbortIfErrorsPlugin');
const BundleCommonChunksPlugin = require('./BundleCommonChunksPlugin');
const CleanDirectoriesPlugin = require('./CleanDirectoriesPlugin');
const CopyStaticFilesPlugin = require('./CopyStaticFilesPlugin');
const EnableProductionLoadersPlugin = require('./EnableProductionLoadersPlugin');
const ExtractCSSPlugin = require('./ExtractCSSPlugin');
const MinifyAndTreeShakePlugin = require('./MinifyAndTreeShakePlugin');
const NodeLoadSourceMapsPlugin = require('./NodeLoadSourceMapsPlugin');

const plugins = {
  'abort-if-errors': AbortIfErrorsPlugin,
  'bundle-common': BundleCommonChunksPlugin,
  'clean-directories': CleanDirectoriesPlugin,
  'copy-static-files': CopyStaticFilesPlugin,
  'extract-css': ExtractCSSPlugin,
  'production-loaders': EnableProductionLoadersPlugin,
  'minify-and-treeshake': MinifyAndTreeShakePlugin,
  'node-load-sourcemaps': NodeLoadSourceMapsPlugin,
};

function getPlugin(pluginName) {
  return tryToLoadGenerator(pluginName, plugins, 'plugin');
}

module.exports = {
  plugins,
  getPlugin,
};
