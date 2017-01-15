#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')
var argv = require('minimist')(process.argv.slice(2))
var VERSION = require(path.resolve(__dirname, 'package.json')).version

// Command line prelude (version and usage)
var commands = argv._
if (commands.length === 0) {
  if (argv.version) {
    console.log(chalk.green('create-cycle-app version: ' + VERSION))
    process.exit()
  }
  console.error(chalk.red('Usage: create-cycle-app <project-directory> [--flavor] [--verbose]'))
  process.exit(1)
}

createApp(commands[0], argv.verbose, argv.flavor)

// Parse the command line options and run the setup
function createApp (name, verbose, flavor) {
  var appFolder = path.resolve(name)
  var appName = path.basename(appFolder)
  flavor = flavor || 'cycle-scripts'

  // Check the folder for files that can conflict
  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
  } else if (!isSafeToCreateProjectIn(appFolder)) {
    console.log(chalk.red('The directory `' + appFolder + '` contains file(s) that could conflict. Aborting.'))
    process.exit(1)
  }

  preparePackageJson(appFolder, appName, flavor, verbose)
}

function preparePackageJson (appFolder, appName, flavor, verbose) {
  // Start creating the new app
  console.log(chalk.green('Creating a new Cycle.js app in ' + appFolder + '.'))
  console.log()

  // Write some package.json configuration
  var packageJson = {
    name: appName,
    version: '0.1.0',
    private: true
  }
  fs.writeFileSync(
    path.join(appFolder, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  installScripts(appFolder, appName, flavor, verbose)
}

// Install and init scripts
function installScripts (appFolder, appName, flavor, verbose) {
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

function getPackageName (installPackage) {
  if (~installPackage.indexOf('.tgz')) {
    return installPackage.match(/^.+\/(.+)-.+\.tgz$/)[1]
  } else if (~installPackage.indexOf('@')) {
    return installPackage.split('@')[0]
  }
  return path.basename(installPackage)
}

function isSafeToCreateProjectIn (appFolder) {
  var whitelist = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE'
  ]
  return fs.readdirSync(appFolder)
    .every(function (file) {
      return whitelist.indexOf(file) >= 0
    })
}
