const ModulesResolver = require('./ModulesResolver');

module.exports = function(options) {
  const result = ModulesResolver(options);
  result.modules = result.modules.concat('node_modules');
  return result;
};
