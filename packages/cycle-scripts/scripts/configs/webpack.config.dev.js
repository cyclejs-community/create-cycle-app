const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    main: [
      path.join(process.cwd(), 'src', 'index.js'),
      'webpack/hot/only-dev-server'
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
      template: './index.ejs',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    new webpack.ProvidePlugin({
      snabb: 'snabbdom-jsx'
    })
  ],
  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    },
    hot: true,
    historyApiFallback: true,
    inline: true
  },
  devtool: 'cheap-module-source-map'
}

// BASIC TO IMPLEMENT
// [X] webpack2
// [X] preset-env
// [ ] babili
// [ ] cross-spawn
// [X] HtmlWebpackPlugin
// [ ] CopyWebpackPlugin
// [X] JSX -> ProvidePlugin({snabb: 'snabbdom-jsx'})

// NICE TO HAVE
// [ ] prettier => prettier-webpack-plugin
// [X] devServer.proxy({'/api': { target: 'http://localhost:3000' }})
// [ ] CSS: postcss, extractText, type-style
// [ ] YARN
