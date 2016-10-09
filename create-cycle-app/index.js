'use strict'

var fs = require('fs')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')
var semver = require('semver')
var argv = require('minimist')(process.argv.slice(2))
var pathExists = require('path-exists')

// Command line prelude (version and usage)
var commands = argv._
if (commands.length === 0) {
  if (argv.version) {
    console.log(
      chalk.green('create-cycle-app version: ' + require('./package.json').version)
    )
    process.exit()
  }
  console.error(
    chalk.red('Usage: create-cycle-app <project-directory> [--scripts-version] [--verbose]')
  )
  process.exit(1)
}

createApp(commands[0], argv.verbose, argv['scripts-version'])

// Parse the command line options and run the setup
function createApp (name, verbose, version) {
  var root = path.resolve(name)
  var appName = path.basename(root)

  // Validate the app name against a whitelist
  // checkAppName(appName)

  // Check the folder for files that can conflict
  if (!pathExists.sync(name)) {
    fs.mkdirSync(root)
  } else if (!isSafeToCreateProjectIn(root)) {
    console.log(
      chalk.red('The directory `' + name + '` contains file(s) that could conflict. Aborting.')
    )
    process.exit(1)
  }

  // TODO: Inquirer for flavor

  // Start creating the new app
  console.log(
    chalk.green('Creating a new Cycle.js app in ' + root + '.')
  )
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

  installScripts(root, appName, version, verbose)
}

// Install and init scripts
function installScripts (root, appName, version, verbose) {
  var originalDirectory = process.cwd()
  process.chdir(root)

  // Install dependencies
  console.log(
    chalk.green('Installing packages. This might take a couple minutes.')
  )
  console.log(
    chalk.green('Installing cycle-scripts from npm...')
  )
  console.log()

  // Find the right version
  var installPackage = getInstallPackage(version)
  var packageName = getPackageName(installPackage)
  var args = [
    'install',
    verbose && '--verbose',
    '--save-dev',
    '--save-exact',
    installPackage
  ].filter(function (a) { return a })

  // Trigger npm installation
  var proc = spawn('npm', args, {stdio: 'inherit'})
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error('`npm ' + args.join(' ') + '` failed')
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
    init(root, appName, verbose, originalDirectory)
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
