'use strict'

var fs = require('fs-extra')
var path = require('path')
var spawn = require('cross-spawn')
var chalk = require('chalk')

function dependencies (streamLib) {
  var basicDependencies = [
    '@cycle/dom',
    'xstream'
  ]

  switch (streamLib) {
    case 'xstream':
      return basicDependencies.concat(['@cycle/xstream-run'])
    case 'most':
      return basicDependencies.concat(['@cycle/most-run', 'most'])
    case 'rxjs':
      return basicDependencies.concat(['@cycle/rxjs-run', 'rxjs'])
    case 'rx':
      return basicDependencies.concat(['@cycle/rx-run', 'rx'])
    default:
      throw new Error('Unsupported stream library: ' + streamLib)
  }
}

function replacements (streamLib) {
  switch (streamLib) {
    case 'xstream':
      return {
        '--RUN-LIB--': '@cycle/xstream-run',
        '--IMPORT--': "import xs from 'xstream'",
        '--STREAM--': 'xs'
      }
    case 'most':
      return {
        '--RUN-LIB--': '@cycle/most-run',
        '--IMPORT--': "import * as most from 'most'",
        '--STREAM--': 'most'
      }
    case 'rxjs':
      return {
        '--RUN-LIB--': '@cycle/rxjs-run',
        '--IMPORT--': "import Rx from 'rxjs'",
        '--STREAM--': 'Rx.Observable'
      }
    case 'rx':
      return {
        '--RUN-LIB--': '@cycle/rx-run',
        '--IMPORT--': "import Rx from 'rx'",
        '--STREAM--': 'Rx.Observable'
      }
    default:
      throw new Error('Unsupported stream library: ' + streamLib)
  }
}

function replaceTags (content, ctx) {
  var newContent = content
  Object.keys(ctx).forEach(function (tag) {
    newContent = newContent.replace(tag, ctx[tag])
  })
  return newContent
}

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

function patchIndexJs (appPath, tags) {
  var indexJsPath = path.join(appPath, 'src', 'index.js')
  var content = fs.readFileSync(indexJsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexJsPath,
    replaceTags(content, tags)
  )
}

function patchAppJs (appPath, tags) {
  var indexJsPath = path.join(appPath, 'src', 'app.js')
  var content = fs.readFileSync(indexJsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexJsPath,
    replaceTags(content, tags)
  )
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
  console.log(chalk.cyan('  npm run take-off-training-wheels'))
  console.log('    Removes this tool and copies build dependencies, configuration files')
  console.log('    and scripts into the app directory. If you do this, you can\'t go back!')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd ' + appName))
  console.log(chalk.cyan('  npm start'))
  console.log()
  console.log('Happy cycling!')
}

module.exports = function (appPath, appName, streamLib, verbose, originalDirectory) {
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
    'take-off-training-wheels': 'cycle-scripts take-off-training-wheels'
  }
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
  var tags = replacements(streamLib)
  patchIndexJs(appPath, tags)
  patchAppJs(appPath, tags)

  console.log('Installing dependencies from npm...')
  console.log()

  var args = [
    'install'
  ].concat(
    dependencies(streamLib) // Flavor dependencies
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
