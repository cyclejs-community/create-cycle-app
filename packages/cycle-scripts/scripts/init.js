'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')

const basicDependencies = [
  '@cycle/dom',
  '@cycle/run',
  'xstream'
]

function patchGitignore (appPath) {
  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  const gitignorePath = path.join(appPath, 'gitignore')
  const dotGitignorePath = path.join(appPath, '.gitignore')
  fs.move(gitignorePath, dotGitignorePath, [], (err) => {
    if (err) {
      // Append if there's already a `.gitignore` file there
      if (err.code === 'EEXIST') {
        const content = fs.readFileSync(gitignorePath)
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
  console.log(`Success! Created ${appName} at ${appPath}`)
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
  console.log(chalk.cyan(`  cd ${appName}`))
  console.log(chalk.cyan('  npm start'))
  console.log()
  console.log('If you have questions, issues or feedback about Cycle.js and create-cycle-app, please, join us on the Gitter:')
  console.log()
  console.log(chalk.cyan('  https://gitter.im/cyclejs/cyclejs'))
  console.log()
  console.log('Happy cycling!')
  console.log()
}

module.exports = function init (appPath, appName, verbose, originalDirectory) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name
  const ownPath = path.join(appPath, 'node_modules', ownPackageName)
  const appPackageJson = path.join(appPath, 'package.json')
  const appPackage = require(appPackageJson)

  // Manipulate app's package.json
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = appPackage.devDependencies || {}
  appPackage.scripts = {
    'start': 'cycle-scripts start',
    'test': 'cycle-scripts test',
    'build': 'cycle-scripts build',
    'eject': 'cycle-scripts eject'
  }

  appPackage.babel = {
    presets: [
      [ 'env', {
        'targets': {
          'browsers': ['last 2 versions', 'safari >= 7']
        }
      }]
    ],
    plugins: [
      'syntax-jsx',
      ['transform-react-jsx', { pragma: 'snabb.html' }]
    ]
  }

  fs.writeFileSync(
    appPackageJson,
    JSON.stringify(appPackage, null, 2)
  )

  // Copy flavor files
  fs.copySync(path.join(ownPath, 'template'), appPath)
  patchGitignore(appPath)

  const listOfbasicDependencies = basicDependencies
    .slice(0, (basicDependencies.length - 1))
    .join(', ')
    .concat(` and ${basicDependencies.slice(-1)}`)

  console.log(`Installing ${listOfbasicDependencies} using npm...`)
  console.log()

  const args = [
    'install'
  ].concat(
    basicDependencies
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
