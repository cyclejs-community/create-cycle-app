'use strict'

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

module.exports = function preparePackageJson (appFolder, appName, cb) {
  // Start creating the new app
  console.log(chalk.green(`Creating a new Cycle.js app in ${appFolder}.`))
  console.log()

  // Write some package.json configuration
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true
  }
  fs.writeFileSync(
    path.join(appFolder, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )
  cb()
}
