'use strict'

const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const config = require('./configs/webpack.config.dev')
const devServerConfig = require('./configs/webpackDevServer.config')

process.env.NODE_ENV = 'development'

const compiler = webpack(config)
compiler.plugin('done', () => {
  console.log(`App is running at ${devServerConfig.host}:${devServerConfig.port}`)
})

const server = new WebpackDevServer(compiler, devServerConfig)
server.listen(devServerConfig.port)
