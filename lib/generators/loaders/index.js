const tryToLoadGenerator = require('../tryToLoadGenerator').tryToLoadGenerator;

const ESNextReactLoader = require('./ESNextReactLoader');
const JSONLoader = require('./JSONLoader');
const CSSLoader = require('./CSSLoader');
const LessLoader = require('./LessLoader');
const IgnoreStylesLoader = require('./IgnoreStylesLoader');

const loaders = {
  'esnextreact': ESNextReactLoader,
  'ESNextReact': ESNextReactLoader,
  'json': JSONLoader,
  'css': CSSLoader,
  'less': LessLoader,
  'ignore-styles': IgnoreStylesLoader,
};

const getLoader = function(loaderName) {
  return tryToLoadGenerator(loaderName, loaders, 'loader');
};

module.exports = {
  loaders,
  getLoader,
};
