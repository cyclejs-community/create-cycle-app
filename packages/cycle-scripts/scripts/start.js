'use strict'

const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')

const config = require('./configs/webpack.config.dev')
const devServerConfig = require('./configs/webpackDevServer.config')
const createWebpackCompiler = require('./utils/createWebpackCompiler')
const openBrowser = require('./utils/openBrowser')

process.env.NODE_ENV = 'development'

const cli = 'npm'
const protocol = devServerConfig.https ? 'https' : 'http'
const host = devServerConfig.host
const port = devServerConfig.port

function run (port) {
  const compiler = createWebpackCompiler(
    config,
    function onReady (showInstructions) {
      if (!showInstructions) {
        return
      }
      console.log()
      console.log('The app is running at:')
      console.log()
      console.log(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`)
      console.log()
      console.log('Note that the development build is not optimized.')
      console.log(
        `To create a production build, use ${chalk.cyan(`${cli} run build`)}.`
      )
      console.log()
    }
  )

  const devServer = new WebpackDevServer(compiler, devServerConfig)

  devServer.listen(port, err => {
    if (err) {
      return console.log(err)
    }

    console.log(chalk.cyan('Starting the development server...'))
    console.log()

    openBrowser(`${protocol}://${host}:${port}/`)
  })
}

run(port)
