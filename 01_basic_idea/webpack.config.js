'use strict';

var webpack = require('webpack');

module.exports = {
  devtool: 'sourcemap',
  entry: './index.js',
  output: {
    filename: "bundle.js",
    path: __dirname + "/build",
    publicPath: "http://localhost:8080/build/"
  },
  resolve: {
    alias: {
      'virtual-css$': require.resolve('./virtual-css'),
      // 'react-style$': require.resolve('../../../lib/index')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ]
  },
  plugins: [
    // new ReactStylePlugin('bundle.css'),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     // To enable production mode:
    //     // NODE_ENV: JSON.stringify('production')
    //   }
    // })
  ]
};
