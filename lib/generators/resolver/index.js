const tryToLoadGenerator = require('../tryToLoadGenerator').tryToLoadGenerator;

const SimpleResolver = require('./SimpleResolver');
const ModulesResolver = require('./ModulesResolver');
const NPMAndModulesResolver = require('./NPMAndModulesResolver');

const resolvers = {
  'simple': SimpleResolver,
  'modules': ModulesResolver,
  'npm-and-modules': NPMAndModulesResolver,
};

function getResolver(resolverName) {
  return tryToLoadGenerator(resolverName, resolvers, 'resolver');
}

module.exports = {
  resolvers,
  getResolver,
};
