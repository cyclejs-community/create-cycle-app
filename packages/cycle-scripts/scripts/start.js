'use strict'
const spawn = require('cross-spawn')
const path = require('path')

const env = Object.create(process.env)
env.NODE_ENV = 'development'

const webpack = path.resolve(__dirname, '..', '..', '.bin', 'webpack-dev-server')

spawn.sync(webpack, ['--config', path.join(__dirname, 'configs', 'webpack.config.dev.js')], { env: env, stdio: 'inherit' })

// 'use strict'

// const webpack = require('webpack')
// const WebpackDevServer = require('webpack-dev-server')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// const host = 'http://localhost'
// const port = 8000

// const config = {
//   entry: [
//     `webpack-dev-server/client?${host}:${port.toString()}`,
//     'webpack/hot/dev-server',
//     './src/'
//   ],
//   output: {
//     filename: 'bundle.js',
//     path: '/'
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
//     new webpack.HotModuleReplacementPlugin(),
//     new ProgressBarPlugin()
//   ]
// }

// const compiler = webpack(config)
// compiler.plugin('done', () => {
//   console.log(`App is running at ${host}:${port}`)
// })
// const server = new WebpackDevServer(compiler, {
//   historyApiFallback: true,
//   hot: true,
//   contentBase: './public',
//   stats: 'errors-only'
// })
// server.listen(port)
