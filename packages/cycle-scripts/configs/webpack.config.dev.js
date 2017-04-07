'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    main: [
      require.resolve('cycle-dev-utils/webpackHotDevClient'),
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
          cacheDirectory: true,
          presets: [
            [ 'env', {
              'targets': {
                'browsers': ['last 2 versions']
              }
            }]
          ],
          plugins: [
            ['transform-react-jsx', { pragma: 'Snabbdom.createElement' }]
          ]
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
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ],
  devtool: 'cheap-module-source-map'
}
