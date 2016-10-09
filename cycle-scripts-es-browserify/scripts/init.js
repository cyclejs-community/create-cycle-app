'use strict'

var fs = require('fs')
var {join} = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')

const dependencies = [
  '@cycle/xstream-run',
  '@cycle/dom',
  'xstream'
]

module.exports = function (appPath, appName, verbose, originalDirectory) {
  var ownPackageName = require(join(__dirname, '..', 'package.json')).name
  var ownPath = join(appPath, 'node_modules', ownPackageName)
  var appPackageJson = join(appPath, 'package.json')
  var appPackage = require(appPackageJson)

  // Manipulate app's package.json
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = appPackage.devDependencies || {}
  appPackage.scripts = {
    'start': 'cycle-scripts start',
    'test': 'cycle-scripts test',
    'build': 'cycle-scripts build',
    'take-out-bike-wheels': 'cycle-scripts take-out-bike-wheels'
  }
  fs.writeFileSync(
    appPackageJson,
    JSON.stringify(appPackage, null, 2)
  )

  // Copy flavor files
  fs.copySync(join(ownPath, 'template'), appPath)

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  var gitignorePath = join(appPath, 'gitignore')
  var dotGitignorePath = join(appPath, '.gitignore')
  fs.move(gitignorePath, dotGitignorePath, [], function (err) {
    if (err) {
      // Append if there's already a `.gitignore` file there
      if (err.code === 'EEXIST') {
        var data = fs.readFileSync(gitignorePath)
        fs.appendFileSync(dotGitignorePath, data)
        fs.unlinkSync(gitignorePath)
      } else {
        throw err
      }
    }
  })

  console.log('Installing dependencies from npm...')
  console.log()

  var args = [
    'install'
  ].concat(
    dependencies // Flavor dependencies
  ).concat([
    '--save',
    verbose && '--verbose'
  ]).filter(function (a) { return a })

  var proc = spawn('npm', args, {stdio: 'inherit'})
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error('`npm ' + args.join(' ') + '` failed')
      return
    }

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
    console.log(chalk.cyan('  npm run take-out-bike-wheels'))
    console.log('    Removes this tool and copies build dependencies, configuration files')
    console.log('    and scripts into the app directory. If you do this, you can\'t go back!')
    console.log()
    console.log('We suggest that you begin by typing:')
    console.log()
    console.log(chalk.cyan('  cd ' + appName))
    console.log(chalk.cyan('  npm start'))
    console.log()
    console.log('Happy cycling!')
  })
}
