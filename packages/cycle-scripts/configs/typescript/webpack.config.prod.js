'use strict'

// Silence webpack2 deprecation warnings
// https://github.com/vuejs/vue-loader/issues/666
process.noDeprecation = true

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')

// Paths to be used for webpack configuration
const paths = {
  appSrc: path.join(process.cwd(), 'src'),
  appIndex: path.join(process.cwd(), 'src', 'index.ts'),
  appBuild: path.join(process.cwd(), 'build'),
  public: '/'
}

module.exports = {
  entry: {
    main: [
      // Your app's code
      paths.appIndex
    ]
  },
  output: {
    // This is the productin JS bundle containing code from all our entry points.
    filename: 'bundle.js',
    // The output path where webpack will write the bundle
    path: paths.appBuild
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        // We use babel-loader to transipile every .js or .jsx file
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // Including over excluding as a whitelist is easier to maintain than a blacklist.
        // as per http://stackoverflow.com/questions/31675025/how-to-exclude-nested-node-module-folders-from-a-loader-in-webpack
        include: paths.appSrc,
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          // Instead of relying on a babelrc file to configure babel (or in package.json configs)
          // We speficy here which presets to use. In the future this could be moved to it's own
          // package as create-react-app does with their 'babel-preset-react-app module.
          // As uglify doesn't support es6 code yet, the uglify param will tell babel plugin to transpile to es5
          // in order for the output to be uglified.
          presets: [
            [ 'env', {
              'targets': {
                'browsers': ['last 2 versions'],
                uglify: true
              }
            }]
          ],
          plugins: [
            // https://cycle.js.org/getting-started.html#getting-started-coding-consider-jsx
            // This allow us to use JSX to create virtual dom elements instead of Snabbdom helpers like div(), input(), ..
            ['transform-react-jsx', { pragma: 'Snabbdom.createElement' }],
            // Allow Babel to transform rest properties for object destructuring assignment and spread properties for object literals.
            ['transform-object-rest-spread']
          ]
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    // Makes environment variables available to the JS code, fallback to 'production'
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')
    }),
    // To be used for JSX support
    new webpack.ProvidePlugin({
      Snabbdom: 'snabbdom-pragma'
    }),
    // Uglify plugin, depending on the devtool options, Source Maps are generated.
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: this.devtool && this.devtool.indexOf('source-map') >= 0
    })
  ],
  devtool: 'cheap-module-source-map'
}
