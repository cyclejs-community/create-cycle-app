#!/usr/bin/env node

'use strict'

var fs = require('fs')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')
var semver = require('semver')
var argv = require('minimist')(process.argv.slice(2))
var pathExists = require('path-exists')
var request = require('request')
var inquirer = require('inquirer')

var VERSION = require('./package.json').version

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

  // Check the folder for files that can conflict
  if (!pathExists.sync(appFolder)) {
    fs.mkdirSync(appFolder)
  } else if (!isSafeToCreateProjectIn(appFolder)) {
    console.log(chalk.red('The directory `' + appFolder + '` contains file(s) that could conflict. Aborting.'))
    process.exit(1)
  }

  var streamLibQuestion = {
    name: 'streamLib',
    message: 'Which stream library do you want to use?',
    type: 'list',
    choices: [
      {
        name: 'XStream, tailored for Cycle.js',
        value: 'xstream'
      },
      {
        name: 'Most.js, a blazing fast stream library',
        value: 'most'
      },
      {
        name: 'RxJS v5',
        value: 'rxjs'
      },
      {
        name: 'RxJS v4',
        value: 'rx'
      }
    ]
  }

  if (flavor) {
    // Ask just for the stream library
    inquirer.prompt([streamLibQuestion]).then(function (answers) {
      preparePackageJson(appFolder, appName, flavor, answers.streamLib, verbose)
    })
  } else {
    fetchFlavors(function (err, flavors) {
      if (err) {
        throw err
      }

      inquirer.prompt([
        {
          name: 'flavor',
          message: 'Which flavor do you want to use?',
          type: 'list',
          choices: flavors
        },
        streamLibQuestion
      ]).then(function (answers) {
        preparePackageJson(appFolder, appName, answers.flavor, answers.streamLib, verbose)
      })
    })
  }
}

function fetchFlavors (cb) {
  console.log()
  console.log(chalk.cyan('Fetching available flavors'))
  console.log()

  // NOTE: Maybe change the method to discover flavors
  request({
    url: 'https://api.github.com/gists/0f33b55f62baca22c6bdb73b56333311',
    headers: {
      'User-Agent': 'create-cycle-app ' + VERSION
    }
  }, function (err, res, body) {
    if (err) {
      cb(err)
    }
    if (res.statusCode !== 200) {
      console.error(chalk.red('Flavors request failed with status: ' + res.statusCode))
      return
    }

    var gist = JSON.parse(body)
    request({
      url: gist.files['flavors.json'].raw_url,
      headers: {
        'User-Agent': 'create-cycle-app ' + VERSION
      }
    }, function (err, res, body) {
      if (err) {
        cb(err)
      }
      if (res.statusCode !== 200) {
        console.error(chalk.red('Flavors request failed with status: ' + res.statusCode))
        return
      }

      var flavors = JSON.parse(body)
      cb(null, flavors)
    })
  })
}

function preparePackageJson (appFolder, appName, flavor, streamLib, verbose) {
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

  installScripts(appFolder, appName, flavor, streamLib, verbose)
}

// Install and init scripts
function installScripts (appFolder, appName, flavor, streamLib, verbose) {
  var originalDirectory = process.cwd()
  process.chdir(appFolder)

  // Find the right version
  var scriptsPackage = getInstallPackage(originalDirectory, flavor)
  var packageName = getPackageName(scriptsPackage)

  // Install dependencies
  console.log(chalk.green('Installing packages. This might take a couple minutes.'))
  console.log(chalk.green('Installing ' + packageName + ' from npm...'))
  console.log()

  var args = [
    'install',
    verbose && '--verbose',
    '--save-dev',
    '--save-exact',
    scriptsPackage
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
    init(appFolder, appName, streamLib, verbose, originalDirectory)
  })
}

function getInstallPackage (originalDirectory, version) {
  var packageToInstall = 'cycle-scripts'
  var validSemver = semver.valid(version)
  if (validSemver) {
    packageToInstall += '@' + version
  } else if (version) {
    // for tar.gz or alternative paths
    packageToInstall = version
  }
  return path.resolve(originalDirectory, packageToInstall)
}

function getPackageName (installPackage) {
  if (~installPackage.indexOf('.tgz')) {
    return installPackage.match(/^.+\/(.+)-.+\.tgz$/)[1]
  } else if (~installPackage.indexOf('@')) {
    return installPackage.split('@')[0]
  }
  return path.basename(installPackage)
}

// function checkNodeVersion (packageName) {
//   var packageJsonPath = path.resolve(
//     process.cwd(),
//     'node_modules',
//     packageName,
//     'package.json'
//   )
//   var packageJson = require(packageJsonPath)
//   if (!packageJson.engines || !packageJson.engines.node) {
//     return
//   }
//
//   if (!semver.satisfies(process.version, packageJsonPath.engines.node)) {
//     console.error(
//       chalk.red(
//         'You are currently running Node %s but create-cycle-app requires %s. ' +
//         'Please use a supported version of Node.\n'
//       ),
//       process.version,
//       packageJsonPath.engines.node
//     )
//     process.exit(1)
//   }
// }

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
