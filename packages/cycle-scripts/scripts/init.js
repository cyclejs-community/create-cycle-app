'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const inquirer = require('inquirer')

// Ask the user for which language and which stream library he want to use
const dependencies = {
  basics: [
    '@cycle/dom@17.1.0'
  ],
  language: {
    'JavaScript': [],
    'TypeScript': []
  },
  streamLib: {
    xstream: [
      '@cycle/run@3.1.0',
      'xstream@10.5.0'
    ],
    rxjs: [
      '@cycle/rxjs-run@7.0.0',
      'rxjs@5.3.0'
    ],
    most: [
      '@cycle/most-run@7.1.0',
      'most@1.2.2'
    ]
  }
}

const replacements = {
  xstream: {
    run: '@cycle/run',
    import: 'import xs from \'xstream\'',
    stream: 'xs'
  },
  rxjs: {
    run: '@cycle/rxjs-run',
    import: 'import Rx from \'rxjs/Rx\'',
    stream: 'Rx.Observable'
  },
  most: {
    run: '@cycle/most-run',
    import: 'import * as most from \'most\'',
    stream: 'most'
  }
}

const initQuestions = [
  {
    type: 'list',
    name: 'language',
    default: 0,
    choices: ['JavaScript', 'TypeScript'],
    message: 'Which language do you want to use to write your cycle app?'
  },
  {
    type: 'list',
    name: 'streamLib',
    default: 0,
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
        name: 'RxJS',
        value: 'rxjs'
      }
    ],
    message: 'Which reactive stream library do you want to use?'
  }
]

// function patchGitignore (appPath) {
//   // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
//   // See: https://github.com/npm/npm/issues/1862
//   const gitignorePath = path.join(appPath, 'gitignore')
//   const dotGitignorePath = path.join(appPath, '.gitignore')
//   fs.move(gitignorePath, dotGitignorePath, [], (err) => {
//     if (err) {
//       // Append if there's already a `.gitignore` file there
//       if (err.code === 'EEXIST') {
//         const content = fs.readFileSync(gitignorePath)
//         fs.appendFileSync(dotGitignorePath, content)
//         fs.unlinkSync(gitignorePath)
//       } else {
//         throw err
//       }
//     }
//   })
// }

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

  inquirer.prompt(initQuestions).then(answers => {
    const language = answers.language
    const streamLib = answers.streamLib

    const basicDependencies = dependencies.basics
    const languageDependencies = dependencies.language[language]
    const streamLibDependencies = dependencies.streamLib[streamLib]

    const depsToInstall = basicDependencies.concat(languageDependencies).concat(streamLibDependencies)

    // Manipulate app's package.json
    // To be moved to separate module
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
    // fs.copySync(path.join(ownPath, 'template'), appPath)

    fs.ensureDirSync(path.join(appPath, 'public'))
    fs.copySync(path.join(ownPath, 'template/public'), path.join(appPath, 'public'))

    // copy src and transform each of the file
    fs.ensureDirSync(path.join(appPath, 'src'))
    const templatePath = path.join(ownPath, 'template/src', language)
    fs.readdir(templatePath, (err, files) => {
      if (err) {
        throw err
      }
      files.forEach(file => {
        const targetPath = path.join(appPath, 'src', file)
        const fileSrc = require(path.join(templatePath, file))
        const targetSrc = fileSrc(replacements[streamLib])
        fs.outputFile(targetPath, targetSrc)
      })
    })

    fs.copySync(path.join(ownPath, 'template/src', language), path.join(appPath, 'src'))

    // for each file in template/src load them, replace and write them

    // for each library

    // patchGitignore(appPath)

    const dependecyList = depsToInstall
      .slice(0, (depsToInstall.length - 1))
      .join(', ')
      .concat(` and ${depsToInstall.slice(-1)}`)

    console.log(`Installing ${dependecyList} using npm...`)
    console.log()

    const args = [
      'install'
    ].concat(
      depsToInstall
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
  })
}
