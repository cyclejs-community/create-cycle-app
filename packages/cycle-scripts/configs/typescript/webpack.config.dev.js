'use strict'

// Silence webpack2 deprecation warnings
// https://github.com/vuejs/vue-loader/issues/666
process.noDeprecation = true

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
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
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience from Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      // Your app's code
      paths.appIndex
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  output: {
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // Not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // The URL that app is served from. We use "/" in development.
    publicPath: paths.public
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
          // package as create-react-app does with their 'babel-preset-react-app module
          babelrc: false,
          presets: [
            [ 'env', {
              'targets': {
                'browsers': ['last 2 versions']
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
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    // Makes environment variables available to the JS code, fallback to 'development'
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development')
    }),
    // To be used for JSX support
    new webpack.ProvidePlugin({
      Snabbdom: 'snabbdom-pragma'
    })
  ],
  devtool: 'inline-source-map'
}
