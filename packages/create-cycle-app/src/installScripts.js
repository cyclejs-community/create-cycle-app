'use strict'

const chalk = require('chalk')
const spawn = require('cross-spawn')
const console = require('console')
const path = require('path')

const getPackageName = require('./getPackageName')

module.exports = function installScripts (appFolder, appName, options) {
  const verbose = options.verbose
  const flavor = options.flavor
  const cli = options.cli

  // Check if the the the flavor to be used is local
  const local = /^\.\/|^\//.test(flavor)
  // Get the right name of the flavor package
  const packageName = getPackageName(flavor)
  // Install dependencies
  const args = {
    npm: [
      'install',
      verbose && '--verbose',
      '--save-dev',
      '--save-exact',
      flavor
    ].filter(a => a),
    yarn: [
      'add',
      '--exact',
      verbose && '--verbose',
      local ? 'file:' + flavor : flavor
    ].filter(a => a)
  }

  // Trigger npm installation
  console.log(chalk.green('Installing packages. This might take a couple minutes.'))
  console.log(chalk.green(`Installing ${packageName} from ${(local ? 'local' : 'npm')} ...`))
  console.log()

  const proc = spawn(cli, args[cli], {stdio: 'inherit', cwd: appFolder})
  proc.on('error', (e) => console.log(e))
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error(chalk.red(`${cli} \`${args[cli].join(' ')}\` failed`))
      return
    }

    const initScriptPath = path.resolve(
      appFolder,
      'node_modules',
      packageName,
      'scripts',
      'init.js'
    )
    const init = require(initScriptPath)

    // Execute the flavor's specific initialization
    init(appFolder, appName, options)
  })
}
