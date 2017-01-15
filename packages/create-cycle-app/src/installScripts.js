'use strict'

var path = require('path')
var chalk = require('chalk')
var spawn = require('cross-spawn')
var getPackageName = require('./getPackageName')

module.exports = function installScripts (appFolder, appName, flavor, verbose) {
  var originalDirectory = process.cwd()
  process.chdir(appFolder)

  // Find the right version
  var local = ~flavor.indexOf('./')
  var packageName = getPackageName(flavor)

  // Install dependencies
  console.log(chalk.green('Installing packages. This might take a couple minutes.'))
  console.log(chalk.green('Installing ' + packageName + ' from ' + (local ? 'local' : 'npm') + '...'))
  console.log()

  var args = [
    'install',
    verbose && '--verbose',
    '--save-dev',
    '--save-exact',
    local ? path.resolve(originalDirectory, flavor) : flavor
  ].filter(function (a) { return a })

  // Trigger npm installation
  var proc = spawn('npm', args, {stdio: 'inherit'})
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error(chalk.red('`npm ' + args.join(' ') + '` failed'))
      return
    }

    // Validate node version
    // checkNodeVersion(packageName)
    var initScriptPath = path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'scripts',
      'init.js'
    )
    var init = require(initScriptPath)

    // Execute the cycle-scripts's specific initialization
    init(appFolder, appName, verbose, originalDirectory)
  })
}
