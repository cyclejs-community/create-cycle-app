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
      return {
        '--RUN-LIB--': '@cycle/xstream-run',
        '--IMPORT--': "import xs, {Stream} from 'xstream'",
        '--DOM-TYPINGS--': 'xstream-typings',
        '--STREAM-TYPE--': 'Stream',
        '--STREAM--': 'xs'
      }
    case 'most':
      return {
        '--RUN-LIB--': '@cycle/most-run',
        '--IMPORT--': "import * as most from 'most'",
        '--DOM-TYPINGS--': 'most-typings',
        '--STREAM-TYPE--': 'most.Stream',
        '--STREAM--': 'most'
      }
    case 'rxjs':
      return {
        '--RUN-LIB--': '@cycle/rxjs-run',
        '--IMPORT--': "import * as Rx from 'rxjs'",
        '--DOM-TYPINGS--': 'rxjs-typings',
        '--STREAM-TYPE--': 'Rx.Observable',
        '--STREAM--': 'Rx.Observable'
      }
    case 'rx':
      return {
        '--RUN-LIB--': '@cycle/rx-run',
        '--IMPORT--': "import * as Rx from 'rx'",
        '--DOM-TYPINGS--': 'rx-typings',
        '--STREAM-TYPE--': 'Rx.Observable',
        '--STREAM--': 'Rx.Observable'
      }
    default:
      throw new Error('Unsupported stream library: ' + streamLib)
  }
}

function replaceTags (content, tags) {
  var newContent = content
  Object.keys(tags).forEach(function (tag) {
    newContent = newContent.replace(tag, tags[tag])
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

function patchIndexTs (appPath, tags) {
  var indexTsPath = path.join(appPath, 'src', 'index.ts')
  var content = fs.readFileSync(indexTsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexTsPath,
    replaceTags(content, tags)
  )
}

function patchAppTs (appPath, tags) {
  var indexTsPath = path.join(appPath, 'src', 'app.ts')
  var content = fs.readFileSync(indexTsPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    indexTsPath,
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
    'eject': 'cycle-scripts eject'
  }
  fs.writeFileSync(
    appPackageJson,
    JSON.stringify(appPackage, null, 2)
  )

  // Copy flavor files
  fs.copySync(path.join(ownPath, 'template'), appPath)

  patchGitignore(appPath)
  var tags = replacements(streamLib)
  patchIndexTs(appPath, tags)
  patchAppTs(appPath, tags)

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
