'use strict'
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const preparePackageJson = require('./preparePackageJson')
const isSafeToCreateProjectIn = require('./isSafeToCreateProjectIn')

module.exports = function createApp (name, verbose, flavor) {
  const appFolder = path.resolve(name)
  const appName = path.basename(appFolder)
  flavor = flavor || 'cycle-scripts/dom'

  // Check the folder for files that can conflict
  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
  } else if (!isSafeToCreateProjectIn(appFolder)) {
    console.log(chalk.red(`The directory \`${appFolder}\` contains file(s) that could conflict. Aborting.`))
    process.exit(1)
  }
  preparePackageJson(appFolder, appName, flavor, verbose)
}
