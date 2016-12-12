'use strict'

var fs = require('fs-extra')
var path = require('path')
var mkdirp = require('mkdirp')
var webpack = require('webpack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var { CheckerPlugin } = require('awesome-typescript-loader')

var buildPath = path.join(process.cwd(), 'build')
var publicPath = path.join(process.cwd(), 'public')

mkdirp.sync(buildPath)

var compiler = webpack({
  entry: [
    './src/'
  ],
  output: {
    filename: 'bundle.js',
    path: './public/'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript'
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new CheckerPlugin()
  ]
})

compiler.run(function (err, stats) {
  if (err) {
    console.log(err)
  } else {
    fs.copySync(publicPath, buildPath)
  }
})
