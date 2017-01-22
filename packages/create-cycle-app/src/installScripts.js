'use strict'
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const getPackageName = require('./getPackageName')
const console = require('console')
const process = require('process')

module.exports = function installScripts (appFolder, appName, flavor, verbose) {
  const originalDirectory = process.cwd()
  process.chdir(appFolder)

  // Find the right version
  const local = /^\.\/|^\//.test(flavor)
  const packageName = getPackageName(flavor)

  // Install dependencies
  console.log(chalk.green('Installing packages. This might take a couple minutes.'))
  console.log(chalk.green(`Installing ${packageName} from ${(local ? 'local' : 'npm')} ...`))
  console.log()

  const args = [
    'install',
    verbose && '--verbose',
    '--save-dev',
    '--save-exact',
    local ? path.resolve(originalDirectory, flavor) : flavor
  ].filter(function (a) { return a })

  // Trigger npm installation
  const proc = spawn('npm', args, {stdio: 'inherit'})
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error(chalk.red(`npm \`${args.join(' ')}\` failed`))
      return
    }

    // Validate node version
    // checkNodeVersion(packageName)
    const initScriptPath = path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'scripts',
      'init.js'
    )
    const init = require(initScriptPath)

    // Execute the cycle-scripts's specific initialization
    init(appFolder, appName, verbose, originalDirectory)
  })
}
