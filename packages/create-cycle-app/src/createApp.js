'use strict'

const path = require('path')

const createAppDir = require('./createAppDir')
const initQuestions = require('./initQuestions')
const installScripts = require('./installScripts')
const createPackageJson = require('./createPackageJson')
const shouldUseYarn = require('./shouldUseYarn')

module.exports = function createApp (name, verbose, flavor, cli, forceprompt) {
  // The path where the cycle app will be created
  const appPath = path.resolve(name)
  // The name of the cycle app to create
  const appName = path.basename(appPath)
  // Which CLi to use (yarn or npm)
  if (shouldUseYarn()) {
    cli = 'yarn'
  }
  // console.log(cli)
  // If no --flavor is passed (flavor === 'core')
  // We prompt for language and stream library
  // We set the flavor to be 'cycle-scripts'
  if (flavor === 'core' || forceprompt) {
    if (flavor === 'core') {
      flavor = 'cycle-scripts@>=2.0.0'
    }
    initQuestions(answers => {
      createAppDir(appPath)
      createPackageJson(appPath, appName)
      installScripts(appPath, appName, { flavor, verbose, answers, cli })
    })
  // If a --flavor is passed we don't prompt the user
  // We delegate every task to the flavor's init() method itself.
  } else {
    createAppDir(appPath)
    createPackageJson(appPath, appName)
    installScripts(appPath, appName, { flavor, verbose, answers: false, cli })
  }
}
