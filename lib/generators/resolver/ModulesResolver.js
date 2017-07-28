const _ = require('lodash');
const path = require('path');
const SimpleResolver = require('./SimpleResolver');

function resolvePath(strPath) {
  return path.resolve(strPath); // path.resolve seems to have a binding issue;
}

module.exports = function(options) {
  return _.extend(SimpleResolver(options), {
    modules: (options.paths || []).map(resolvePath),
  });
};
