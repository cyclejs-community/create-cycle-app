'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')

const dependencies = require('../../configs/dependencies')
const success = require('./success')

module.exports = function setup (appPath, appName, options) {
  const verbose = options.verbose
  const language = options.answers.language
  const streamLib = options.answers.streamLib
  const cli = options.cli

  // STEP #1 - Create boilerplate files
  const flavorPath = path.join(appPath, 'node_modules', 'cycle-scripts')
  const templateStrings = require(path.join(flavorPath, 'template/config', language + '.js'))
  const templatePath = path.join(flavorPath, 'template/src', language)
  // Create ./public directory
  fs.ensureDirSync(path.join(appPath, 'public'))
  // Copy files from cycle-scripts/template/public to ./public
  fs.copySync(path.join(flavorPath, 'template/public'), path.join(appPath, 'public'))
  // Create ./src directory
  fs.ensureDirSync(path.join(appPath, 'src'))
  // Get templates in cycle-scripts/template/src/<language>
  // Interpolate them and write compiled files in ./src
  const files = fs.readdirSync(templatePath)
  files.forEach(file => {
    const targetPath = path.join(appPath, 'src', file)
    const template = require(path.join(templatePath, file))
    const targetContent = template(templateStrings[streamLib])
    fs.outputFile(targetPath, targetContent)
  })
  // Copy cycle-scripts/template/gitgnore to ./.gitignore
  fs.copySync(path.join(flavorPath, 'template', 'gitignore'), path.join(appPath, '.gitignore'))

  if (language === 'typescript') {
    fs.copySync(path.join(flavorPath, 'template', 'tsconfig.json'), path.join(appPath, 'tsconfig.json'))
    fs.copySync(path.join(flavorPath, 'template', 'custom-typings.d.ts'), path.join(appPath, 'custom-typings.d.ts'))
  }

  // STEP #2 - Edit package.json
  // Retrieve package.json content
  const packageJsonPath = path.join(appPath, 'package.json')
  const packageJsonContent = require(packageJsonPath)
  // Add dependencies to package.json if not already presents
  packageJsonContent.dependencies = packageJsonContent.dependencies || {}
  // Add devDependencies to package.json if not already presents
  packageJsonContent.devDependencies = packageJsonContent.devDependencies || {}
  // Add package.json scripts
  packageJsonContent.scripts = {
    'start': 'cycle-scripts start',
    'test': 'cycle-scripts test',
    'build': 'cycle-scripts build',
    'eject': 'cycle-scripts eject'
  }
  // Add special cca configuration options in package.json. We'll access
  // this configuration from scripts to use the appropriate webpack configuration
  // and files on start, build and eject.
  packageJsonContent.cca = { language, streamLib }
  // Write the edited package.json file to disk
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2)
  )

  // STEP #3 - Install needed dependencies
  // Gather together all the dependencies needed for the flavor
  // Taking into consideration user choices for language and stream library
  // All the dependency locks and configurations can be found in /configs/flavor.js
  const basicDependencies = dependencies.basics
  const streamLibDependencies = dependencies.streamLib[streamLib]
  const languageDependencies = dependencies.language[language]
  const dependenciesToInstall = basicDependencies
    .concat(streamLibDependencies)
    .concat(languageDependencies)
  const dependecyList = dependenciesToInstall
    .slice(0, (dependenciesToInstall.length - 1))
    .join(', ')
    .concat(` and ${dependenciesToInstall.slice(-1)}`)

  const args = {
    npm: [
      'install',
      verbose && '--verbose',
      '--save',
      '--save-exact'
    ]
    .concat(dependenciesToInstall)
    .filter(Boolean),
    yarn: [
      'add',
      '--exact',
      verbose && '--verbose'
    ]
    .concat(dependenciesToInstall)
    .filter(Boolean)
  }

  // const args = [
  //   'install'
  // ].concat(
  //   dependenciesToInstall
  // ).concat([
  //   '--save',
  //   verbose && '--verbose'
  // ]).filter(Boolean)

  console.log(`Installing ${dependecyList} using npm...`)
  console.log()
  var proc = spawn(cli, args[cli], {stdio: 'inherit', cwd: appPath})

  proc.on('close', function (code) {
    if (code !== 0) {
      console.error(chalk.red('`npm ' + args.join(' ') + '` failed'))
      return
    }
    success(appName, appPath)
  })
}
