'use strict'
const path = require('path')
const preparePackageJson = require('./preparePackageJson')
const createProjectIn = require('./createProjectIn')
const installScripts = require('./installScripts')

module.exports = function createApp (name, verbose, flavor) {
  const appFolder = path.resolve(name)
  const appName = path.basename(appFolder)
  flavor = flavor || 'cycle-scripts'

  createProjectIn(appFolder)
  preparePackageJson(appFolder, appName, () => {
    installScripts(appFolder, appName, flavor, verbose)
  })
}
