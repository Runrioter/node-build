// Less loader allows you to write less and import those files in your jsx templates.
// Use with ExtractCSSPlugin  (or manually via ExtractTextPlugin) to bundle the
// css into a single stylesheet.
//
// You can pass `assetsDirectory` to tell webpack where your images live
// This will enable webpack to search for and resolve those images through
// other loaders like 'url-loader' and 'file-loader';
// You can pass `publicPath` to add a public path prefix to resolved images.

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = function(options) {
  const assetsDirectory = options.assetsDirectory;
  const publicPath = options.publicPath;

  const root = assetsDirectory ? `?root=${path.join(process.cwd(), assetsDirectory)}` : '';

  return {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: `css-loader${root}!postcss-loader!less-loader`,
      publicPath,
    }),
  };
};
