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
  console.error(chalk.red('Usage: create-cycle-app <project-directory> [--scripts] [--verbose]'))
  process.exit(1)
}

createApp(commands[0], argv.verbose, argv.scripts)

// Parse the command line options and run the setup
function createApp (name, verbose, scriptsPkg) {
  var root = path.resolve(name)
  var appName = path.basename(root)

  // Validate the app name against a whitelist
  // checkAppName(appName)

  // Check the folder for files that can conflict
  if (!pathExists.sync(name)) {
    fs.mkdirSync(root)
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log(chalk.red('The directory `' + name + '` contains file(s) that could conflict. Aborting.'))
    process.exit(1)
  }

  console.log()
  console.log(chalk.cyan('Fetching available flavors'))
  console.log()

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

  if (scriptsPkg) {
    // Ask just for the stream library
    inquirer.prompt([streamLibQuestion]).then(function (answers) {
      preparePackageJson(root, appName, scriptsPkg, answers.streamLib, verbose)
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
        preparePackageJson(root, appName, answers.flavor, answers.streamLib, verbose)
      })
    })
  }
}

function fetchFlavors (cb) {
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

function preparePackageJson (root, appName, scriptsPkg, streamLib, verbose) {
  // Start creating the new app
  console.log(chalk.green('Creating a new Cycle.js app in ' + root + '.'))
  console.log()

  // Write some package.json configuration
  var packageJson = {
    name: appName,
    version: '0.1.0',
    private: true
  }
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  installScripts(root, appName, scriptsPkg, streamLib, verbose)
}

// Install and init scripts
function installScripts (root, appName, scriptsPkg, streamLib, verbose) {
  var originalDirectory = process.cwd()
  process.chdir(root)

  // Find the right version
  var scriptsPackage = getInstallPackage(scriptsPkg)
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
    checkNodeVersion(packageName)

    var initScriptPath = path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'scripts',
      'init.js'
    )
    var init = require(initScriptPath)

    // Execute the cycle-scripts's specific initialization
    init(root, appName, streamLib, verbose, originalDirectory)
  })
}

function getInstallPackage (version) {
  var packageToInstall = 'cycle-scripts'
  var validSemver = semver.valid(version)
  if (validSemver) {
    packageToInstall += '@' + version
  } else if (version) {
    // for tar.gz or alternative paths
    packageToInstall = version
  }
  return packageToInstall
}

function getPackageName (installPackage) {
  if (~installPackage.indexOf('.tgz')) {
    return installPackage.match(/^.+\/(.+)-.+\.tgz$/)[1]
  } else if (~installPackage.indexOf('@')) {
    return installPackage.split('@')[0]
  }
  return installPackage
}

function checkNodeVersion (packageName) {
  var packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json'
  )
  var packageJson = require(packageJsonPath)
  if (!packageJson.engines || !packageJson.engines.node) {
    return
  }

  if (!semver.satisfies(process.version, packageJsonPath.engines.node)) {
    console.error(
      chalk.red(
        'You are currently running Node %s but create-cycle-app requires %s. ' +
        'Please use a supported version of Node.\n'
      ),
      process.version,
      packageJsonPath.engines.node
    )
    process.exit(1)
  }
}

// function checkAppName (appName) {
//   var dependencies = ['@cycle/xstream-run', '@cycle/dom', 'xstream']
//   var devDependencies = ['browserify', 'babelify', 'babel-preset-es2015', 'mkdirp']
//   var allDependencies = dependencies.concat(devDependencies)
//
//   if (allDependencies.indexOf(appName) >= 0) {
//     console.error(
//       chalk.red(
//         'We cannot create a project called `' + appName + '` because a dependency with the same name exists.\n' +
//         'Due to the way npm works, the following names are not allowed:\n\n'
//       ),
//       chalk.cyan(
//         allDependencies.map(function (name) {
//           return '  ' + name
//         }).join('\n')
//       ) +
//       chalk.red('\n\nPlease choose a different project name.')
//     )
//   }
// }

function isSafeToCreateProjectIn (root) {
  var validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE'
  ]
  return fs.readdirSync(root)
    .every(function (file) {
      return validFiles.indexOf(file) >= 0
    })
}
