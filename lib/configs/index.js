const getDefaultClientConfig = require('./getDefaultClientConfig');
const getDefaultProductionClientConfig = require('./getDefaultProductionClientConfig');
const getDefaultServerConfig = require('./getDefaultServerConfig');
const getDefaultProductionServerConfig = require('./getDefaultProductionServerConfig');
const getDefaultTestingConfig = require('./getDefaultTestingConfig');

function getClientConfig(isProduction, options) {
  const passedOptions = options || {};
  return isProduction 
    ? getDefaultProductionClientConfig(passedOptions) 
    : getDefaultClientConfig(passedOptions);
}

function getServerConfig(isProduction, options) {
  const passedOptions = options || {};
  return isProduction 
    ? getDefaultProductionServerConfig(passedOptions) 
    : getDefaultServerConfig(passedOptions);
}

module.exports = {
  getDefaultClientConfig,
  getDefaultProductionClientConfig,
  getDefaultServerConfig,
  getDefaultProductionServerConfig,
  getDefaultTestingConfig,
  getClientConfig,
  getServerConfig,
};
