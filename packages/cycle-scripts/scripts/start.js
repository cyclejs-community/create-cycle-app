/**
 * BSD License
 * For create-react-app software
 *
 * Copyright (c) 2016-present, Facebook, Inc. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name Facebook nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const path = require('path')

const devServerConfig = require('../configs/webpackDevServer.config')
const createWebpackCompiler = require('./utils/createWebpackCompiler')
const openBrowser = require('react-dev-utils/openBrowser')
const notEjected = require(path.join(process.cwd(), 'package.json')).cca

const config = require(path.join(
  '../configs/',
  notEjected
    ? notEjected.language
    : '',
  'webpack.config.dev')
)
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
