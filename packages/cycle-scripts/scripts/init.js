'use strict'

var fs = require('fs-extra')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')

var dependencies = [
  '@cycle/dom',
  'xstream',
  '@cycle/xstream-run'
]

function patchGitignore (appPath) {
  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  var gitignorePath = path.join(appPath, 'gitignore')
  var dotGitignorePath = path.join(appPath, '.gitignore')
  fs.move(gitignorePath, dotGitignorePath, [], function (err) {
    if (err) {
      // Append if there's already a `.gitignore` file there
      if (err.code === 'EEXIST') {
        var content = fs.readFileSync(gitignorePath)
        fs.appendFileSync(dotGitignorePath, content)
        fs.unlinkSync(gitignorePath)
      } else {
        throw err
      }
    }
  })
}

function successMsg (appName, appPath) {
  console.log()
  console.log('Success! Created ' + appName + ' at ' + appPath)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan('  npm start'))
  console.log('    Starts the development server')
  console.log()
  console.log(chalk.cyan('  npm test'))
  console.log('    Start the test runner')
  console.log()
  console.log(chalk.cyan('  npm run build'))
  console.log('    Bundles the app into static files for production')
  console.log()
  console.log(chalk.cyan('  npm run eject'))
  console.log('    Removes this tool and copies build dependencies, configuration files')
  console.log('    and scripts into the app directory. If you do this, you can\'t go back!')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd ' + appName))
  console.log(chalk.cyan('  npm start'))
  console.log()
  console.log('If you have questions, issues or feedback about Cycle.js and create-cycle-app, please, join us on the Gitter:')
  console.log()
  console.log(chalk.cyan('  https://gitter.im/cyclejs/cyclejs'))
  console.log()
  console.log('Happy cycling!')
}

module.exports = function (appPath, appName, verbose, originalDirectory) {
  var ownPackageName = require(path.join(__dirname, '..', 'package.json')).name
  var ownPath = path.join(appPath, 'node_modules', ownPackageName)
  var appPackageJson = path.join(appPath, 'package.json')
  var appPackage = require(appPackageJson)

  // Manipulate app's package.json
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = appPackage.devDependencies || {}
  appPackage.scripts = {
    'start': 'cycle-scripts start',
    'test': 'cycle-scripts test',
    'build': 'cycle-scripts build',
    'eject': 'cycle-scripts eject'
  }
  // to be moved into own babel config file
  appPackage.babel = {
    'presets': ['es2015']
  }
  fs.writeFileSync(
    appPackageJson,
    JSON.stringify(appPackage, null, 2)
  )

  // Copy flavor files
  fs.copySync(path.join(ownPath, 'template'), appPath)

  patchGitignore(appPath)

  console.log('Installing dependencies from npm...')
  console.log()

  var args = [
    'install'
  ].concat(
    dependencies // Flavor dependencies
  ).concat([
    '--save',
    verbose && '--verbose'
  ]).filter(Boolean)

  var proc = spawn('npm', args, {stdio: 'inherit'})
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error(chalk.red('`npm ' + args.join(' ') + '` failed'))
      return
    }

    successMsg(appName, appPath)
  })
}
