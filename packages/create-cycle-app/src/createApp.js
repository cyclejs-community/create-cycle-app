'use strict'

const path = require('path')

const createProjectIn = require('./createProjectIn')
const initQuestions = require('./initQuestions')
const installScripts = require('./installScripts')
const preparePackageJson = require('./preparePackageJson')

module.exports = function createApp (name, verbose, flavor) {
  const appFolder = path.resolve(name)
  const appName = path.basename(appFolder)

  initQuestions(flavor, options => {
    createProjectIn(appFolder)
    preparePackageJson(appFolder, appName, () => {
      installScripts(appFolder, appName, flavor, verbose, options)
    })
  })
}
