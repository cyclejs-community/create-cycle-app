#!/usr/bin/env node

'use strict'

var fs = require('fs')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')
// var semver = require('semver')
var argv = require('minimist')(process.argv.slice(2))
var pathExists = require('path-exists')
var request = require('request')
var inquirer = require('inquirer')

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

  // Check the folder for files that can conflict
  if (!pathExists.sync(appFolder)) {
    fs.mkdirSync(appFolder)
  } else if (!isSafeToCreateProjectIn(appFolder)) {
    console.log(chalk.red('The directory `' + appFolder + '` contains file(s) that could conflict. Aborting.'))
    process.exit(1)
  }

  function byName (a, b) {
    return a.name >= b.name
  }

  function withoutDiscovery (flavor) {
    return flavor.value !== 'run-discovery'
  }

  var discoverMore = {
    name: 'Discover more...',
    value: 'run-discovery'
  }

  var coreFlavors = require('./coreFlavors.json')

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
    ],
    when: function (currentAnswers) {
      return currentAnswers.flavor !== 'run-discovery'
    }
  }

  if (flavor) {
    // Ask just for the stream library
    inquirer.prompt([streamLibQuestion]).then(function (answers) {
      preparePackageJson(appFolder, appName, flavor, answers.streamLib, verbose)
    })
  } else {
    inquirer.prompt([
      {
        name: 'flavor',
        message: 'Which flavor do you want to use?',
        type: 'list',
        choices: coreFlavors.sort(byName).concat(discoverMore)
      },
      streamLibQuestion
    ]).then(function (answers) {
      // When run-discovery was choosed, we need to discover
      // flavors somewhere else
      if (answers.flavor === 'run-discovery') {
        discoverFlavors(function (err, flavors) {
          if (err) {
            throw err
          }

          inquirer.prompt([
            {
              name: 'flavor',
              message: 'Which flavor do you want to use?',
              type: 'list',
              choices: flavors.sort(byName).concat(coreFlavors.filter(withoutDiscovery))
            },
            streamLibQuestion
          ]).then(function (answers) {
            preparePackageJson(appFolder, appName, answers.flavor, answers.streamLib, verbose)
          })
        })
      } else {
        preparePackageJson(appFolder, appName, answers.flavor, answers.streamLib, verbose)
      }
    })
  }
}

function discoverFlavors (cb) {
  console.log()
  console.log(chalk.cyan('Fetching community flavors...'))
  console.log()

  request({
    url: 'https://api.github.com/repos/cyclejs-community/create-cycle-app/contents/create-cycle-app/communityFlavors.json',
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

    var gitContent = JSON.parse(body)
    request({
      url: gitContent.download_url,
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
    init(appFolder, appName, streamLib, verbose, originalDirectory)
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
