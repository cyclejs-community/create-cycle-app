module.exports = (language, ejected = false) => `'use strict'
// Silence webpack2 deprecation warnings
// https://github.com/vuejs/vue-loader/issues/666
process.noDeprecation = true
const webpack2Block = require('@webpack-blocks/webpack2');
const createConfig = webpack2Block.createConfig
const defineConstants = webpack2Block.defineConstants
const env = webpack2Block.env
const entryPoint = webpack2Block.entryPoint
const setOutput = webpack2Block.setOutput
const sourceMaps = webpack2Block.sourceMaps
const addPlugins = webpack2Block.addPlugins
const babel = require('@webpack-blocks/babel6');
const devServer = require('@webpack-blocks/dev-server2');
${language === 'javascript' ? '' : `const typescript = require('@webpack-blocks/typescript');
`}const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const babelConfig = {
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
const config = [
  entryPoint(path.join(process.cwd(), 'src', 'index.${language === 'javascript' ? 'js' : 'ts' }')),
  setOutput(path.join(process.cwd(), 'build', 'bundle.[hash].js')),
  babel(Object.assign({}, babelConfig, { cacheDirectory: true })),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV
  }),
  addPlugins([
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    new webpack.ProvidePlugin({
      Snabbdom: 'snabbdom-pragma'
    })
  ]),
  env('development', [
    devServer({}, require.resolve('react-dev-utils/webpackHotDevClient')),
    sourceMaps() //The default is cheap-module-source-map
  ]),
  env('production', [
    addPlugins([
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([{ from: 'public', to: '' }]),
      new CleanWebpackPlugin([ path.join(process.cwd(), 'build') ], {
        root: process.cwd()
      })
    ])
  ])${language === 'javascript' ? '' : `,
  typescript({${ !ejected ? `
    configFileName:path.join(__dirname, '..', 'configs', 'tsconfig.json'),` : '' }
    useBabel: true,
    babelOptions: babelConfig,
    useCache: true,
    cacheDirectory: 'node_modules/.cache/at-loader'
  })` }
]
module.exports = createConfig(config)
`
