'use strict'
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var preparePackageJson = require('./preparePackageJson')
var isSafeToCreateProjectIn = require('./isSafeToCreateProjectIn')

module.exports = function createApp (name, verbose, flavor) {
  var appFolder = path.resolve(name)
  var appName = path.basename(appFolder)
  flavor = flavor || 'cycle-scripts'

  // Check the folder for files that can conflict
  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
  } else if (!isSafeToCreateProjectIn(appFolder)) {
    console.log(chalk.red('The directory `' + appFolder + '` contains file(s) that could conflict. Aborting.'))
    process.exit(1)
  }
  preparePackageJson(appFolder, appName, flavor, verbose)
}
