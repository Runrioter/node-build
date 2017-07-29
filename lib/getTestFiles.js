const _ = require('lodash');
const fs = require('fs');

module.exports = function getTestFiles(dir, ext) {
  if (dir.indexOf('node_modules') > -1) { return; }
  if (dir.indexOf('.git') > -1) { return; }

  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    files = [];
  }

  return files
    .map(function(file) {
      const path = dir + file;

      try {
        const stats = fs.statSync(path);
        if (stats.isDirectory()) { return getTestFiles(`${path}/`, ext); }
        if (file.indexOf(ext) > -1) { return { file, path }; }
        return null;
      } catch (e) {
        return null;
      }
    })
    .filter(function(x) { return x; })
    .reduce(function(prev, cur) {
      if (_.isArray(cur)) {
        return prev.concat(cur);
      } 
      return prev.concat([cur]);
      
    }, []);
};
