'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    main: [
      path.join(process.cwd(), 'src', 'index.js')
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(process.cwd(), 'build')
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
                'browsers': ['last 2 versions'],
                uglify: true
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
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}

// 'use strict'

// const fs = require('fs-extra')
// const path = require('path')
// const mkdirp = require('mkdirp')
// const webpack = require('webpack')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// const buildPath = path.join(process.cwd(), 'build')
// const publicPath = path.join(process.cwd(), 'public')

// mkdirp.sync(buildPath)

// const compiler = webpack({
//   entry: [
//     './src/'
//   ],
//   output: {
//     filename: 'bundle.js',
//     path: './public/'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         loader: 'babel',
//         query: {
//           presets: ['es2015']
//         },
//         exclude: /node_modules/
//       }
//     ]
//   },
//   plugins: [
//     new ProgressBarPlugin(),
//     new webpack.optimize.UglifyJsPlugin({minimize: true})
//   ]
// })

// compiler.run((err, stats) => {
//   if (err) {
//     console.log(err)
//   } else {
//     fs.copySync(publicPath, buildPath)
//   }
// })
