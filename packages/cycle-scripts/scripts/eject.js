'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')

const scriptsPath = path.join(process.cwd(), 'scripts')
const ownPackageJsonPath = path.resolve(__dirname, '..', 'package.json')
const appPackageJsonPath = path.join(process.cwd(), 'package.json')
const ownPackageJson = JSON.parse(fs.readFileSync(ownPackageJsonPath))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath))

// Ask the user for confirmation before ejecting.
// Abort in case of negative answer (default)
const ejectConfirmation = {
  type: 'confirm',
  name: 'doEject',
  default: false,
  message: 'Are you sure you want to eject? This action is permanent.'
}

inquirer.prompt([ejectConfirmation]).then(answers => {
  if (!answers.doEject.value) {
    console.log(chalk.cyan('Eject aborted!'))
    return
  }
})

// Declaring new scripts
const scripts = {
  start: 'node scripts/start.js',
  test: 'node scripts/test.js',
  build: 'node scripts/build.js'
}

// Declare the new dependencies, excluding self
let devDependencies = {}
Object.keys(appPackageJson.devDependencies)
  .filter(dep => { return dep !== ownPackageJson.name })
  .forEach(dep => {
    devDependencies[dep] = appPackageJson.devDependencies[dep]
  })
devDependencies = Object.assign({}, devDependencies, ownPackageJson.dependencies)

// Write the new package.json
const newPackageJson = Object.assign({}, appPackageJson, {scripts: scripts, devDependencies: devDependencies})
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newPackageJson, null, 2)
)

// Copy scripts
function copyScript (script) {
  fs.copySync(path.join(__dirname, script), path.join(scriptsPath, script))
}

fs.ensureDirSync(scriptsPath)
copyScript('start.js')
copyScript('test.js')
copyScript('build.js')

// Copy utils
fs.copySync(path.join(__dirname, 'utils'), path.join(scriptsPath, 'utils'))

// Copy configs
fs.copySync(path.join(__dirname, '../', 'configs'), path.join('configs'))

// Todo: provide some success info on success
