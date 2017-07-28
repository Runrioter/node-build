const fs = require('fs-extra'); // gives us recursive copy for directories
const path = require('path');

// Use this to copy static files around after compilation has finished.
// Helpful for copying all of your compiled files or asset files into one directory
// for easy deploys.
module.exports = function(options) {
  return function() {
    this.plugin('done', function() {
      const cwd = process.cwd();
      options.staticPaths.forEach(function(staticPath) {
        const source = staticPath[0];
        const dest = staticPath[1];
        fs.copy(path.join(cwd, source), path.join(cwd, dest), function(error) {
          if (error) {
            console.log('Error copying static files', staticPath, error);
          } else {
            console.log('Copied static files', staticPath);
          }
        });
      });
    });
  };
};
