const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      global: require.resolve('node-libs-browser/mock/global'),
    },
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
};