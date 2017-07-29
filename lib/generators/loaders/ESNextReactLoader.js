module.exports = {
  test: /\.es6\.js$|\.js$|\.jsx$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: [
      ['es2015', { modules: false }],
      'stage-2',
      'react',
    ].map(function(p) {
      if (Array.isArray(p)) {
        return [require.resolve(`babel-preset-${p[0]}`), p[1]];
      }
      return require.resolve(`babel-preset-${p}`);
    }),
    plugins: [
      'transform-class-properties',
      'transform-react-constant-elements',
      'transform-react-inline-elements',
      'lodash', // fixes the babel budnling issue
    ].map(function(p) { return require.resolve(`babel-plugin-${p}`); }),
  },
};
