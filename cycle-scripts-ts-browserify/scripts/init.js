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
      return basicDependencies.concat(['@cycle/rx-run', 'rx', '@types/rx'])
    default:
      throw new Error('Unsupported stream library: ' + streamLib)
  }
}

function replacements (streamLib) {
  switch (streamLib) {
    case 'xstream':
      return [
        '@cycle/xstream-run',
        "import xs, {Stream} from 'xstream'",
        'xstream-typings',
        'Stream',
        'xs'
      ]
    case 'most':
      return [
        '@cycle/most-run',
        "import * as most from 'most'",
        'most-typings',
        'most.Stream',
        'most'
      ]
    case 'rxjs':
      return [
        '@cycle/rxjs-run',
        "import * as Rx from 'rxjs'",
        'rxjs-typings',
        'Rx.Observable',
        'Rx.Observable'
      ]
    case 'rx':
      return [
        '@cycle/rx-run',
        "import * as Rx from 'rx'",
        'rx-typings',
        'Rx.Observable',
        'Rx.Observable'
      ]
    default:
      throw new Error('Unsupported stream library: ' + streamLib)
  }
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

function patchIndexTs (appPath, runLib) {
  var indexTsPath = path.join(appPath, 'src', 'index.ts')
  var content = fs.readFileSync(indexTsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexTsPath,
    content
      .replace('--RUN-LIB--', runLib)
  )
}

function patchAppTs (appPath, importPath, domTypings, streamType, stream) {
  var indexTsPath = path.join(appPath, 'src', 'app.ts')
  var content = fs.readFileSync(indexTsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexTsPath,
    content
      .replace('--IMPORT--', importPath)
      .replace('--DOM-TYPINGS--', domTypings)
      .replace('--STREAM-TYPE--', streamType)
      .replace('--STREAM--', stream)
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
  var ownPackageName = require(path.resolve(__dirname, '..', 'package.json')).name
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
  fs.writeFileSync(
    appPackageJson,
    JSON.stringify(appPackage, null, 2)
  )

  // Copy flavor files
  fs.copySync(path.join(ownPath, 'template'), appPath)

  patchGitignore(appPath)
  var repl = replacements(streamLib)
  patchIndexTs(appPath, repl[0])
  patchAppTs(appPath, repl[1], repl[2], repl[3], repl[4])

  // TODO: Remove @types/core-js after cyclejs/cyclejs#454
  console.log('Installing dependencies from npm...')
  console.log()

  var args = [
    'install'
  ].concat(
    dependencies(streamLib)
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
