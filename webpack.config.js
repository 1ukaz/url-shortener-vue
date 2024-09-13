// webpack.config.js
const webpack = require('webpack');

module.exports = {
  // otras configuraciones...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
    }),
  ],
};
