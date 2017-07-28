const tryToLoadGenerator = require('../tryToLoadGenerator').tryToLoadGenerator;
const AutoprefixerPostCSS = require('./AutoprexiferPostCSS');

const postCSSHooks = {
  'autoprefixer-custom': AutoprefixerPostCSS,
  'autoprefixer': AutoprefixerPostCSS({ numVersions: 2 }),
};

const getPostCSS = function(postCSSHookName) {
  return tryToLoadGenerator(postCSSHookName, postCSSHooks, 'postcsshooks');
};

module.exports = {
  postCSSHooks,
  getPostCSS,
};
