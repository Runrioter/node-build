const getLoader = require('./loaders').getLoader;
const getPlugin = require('./plugins').getPlugin;
const getOutput = require('./output').getOutput;
const getResolver = require('./resolver').getResolver;
const getEntry = require('./entry').getEntry;
const getExternals = require('./externals').getExternals;
const getPostCSS = require('./postcss').getPostCSS;

module.exports = {
  getLoader,
  getPlugin,
  getOutput,
  getResolver,
  getEntry,
  getExternals,
  getPostCSS,
};
