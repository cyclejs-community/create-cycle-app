'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const devServer = require('./webpackDevServer.config')

module.exports = {
  entry: {
    main: [
      `webpack-dev-server/client?http://${devServer.host}:${devServer.port.toString()}`,
      'webpack/hot/dev-server',  // 'webpack/hot/only-dev-server'
      path.join(process.cwd(), 'src', 'index.js')
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(process.cwd(), 'build', 'bundle.js')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    new webpack.ProvidePlugin({
      Snabbdom: 'snabbdom-pragma'
    })
  ],
  devtool: 'cheap-module-source-map'
}
