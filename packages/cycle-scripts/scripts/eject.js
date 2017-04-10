'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')

const appPath = path.join(process.cwd())
const appScriptsPath = path.join(process.cwd(), 'scripts')
const flavorPackageJson = require(path.join(__dirname, '..', 'package.json'))
const appPackageJson = require(path.join(appPath, 'package.json'))
const language = appPackageJson.cca.language

const ejectConfirmation = {
  type: 'confirm',
  name: 'doEject',
  default: false,
  message: 'Are you sure you want to eject? This action is permanent.'
}

// Ask the user for confirmation before ejecting.
inquirer.prompt([ejectConfirmation]).then(answers => {
  // Abort in case of negative answer (default)
  if (!answers.doEject) {
    console.log(chalk.cyan('Eject aborted!'))
    return process.exit(0)
  }

  // STEP 1 - Prepare package.json
  // Declaring new scripts
  const scripts = {
    start: 'node scripts/start.js',
    test: 'node scripts/test.js',
    build: 'node scripts/build.js'
  }
  // Remove flavor from devpendencies
  delete appPackageJson.devDependencies[flavorPackageJson.name]
  // Remove cca settings
  delete appPackageJson.cca
  // Flavor's dependencies -> application devDependency.
  // We merge flavor's dependencies with application's devDepependencies
  const devDependencies = Object.assign(
    {},
    appPackageJson.devDependencies,
    flavorPackageJson.dependencies
  )
  // New package.json content
  const packageJsonContent = Object.assign(
    {},
    appPackageJson,
    {
      scripts,
      devDependencies
    }
  )
  // Overide application's package.json with the new content
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2)
  )

  // STEP 2 - Copy scripts
  function copyScript (script) {
    fs.copySync(path.join(__dirname, script), path.join(appScriptsPath, script))
  }
  // Make sure appScriptsPath exists
  fs.ensureDirSync(appScriptsPath)
  // Copy over start, test and build scripts
  copyScript('start.js')
  copyScript('test.js')
  copyScript('build.js')

  // STEP 3 - Copy utils
  fs.copySync(path.join(__dirname, 'utils'), path.join(appScriptsPath, 'utils'))

  // STEP 4 - Copy configs
  fs.copySync(path.join(__dirname, '../', 'configs', language), path.join(appPath, 'configs'))
  fs.copySync(path.join(__dirname, '../', 'configs', 'webpackDevServer.config.js'), path.join(appPath, 'configs', 'webpackDevServer.config.js'))

  // TODO sucess message
})
