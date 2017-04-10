'use strict'

const chalk = require('chalk')
const console = require('console')
const fs = require('fs')
const path = require('path')

module.exports = function createPackageJson (appPath, appName) {
  // Prepare package.json
  const content = {
    name: appName,
    version: '0.1.0',
    private: true
  }
  const packageJsonContent = JSON.stringify(content, null, 2)

  // Write package.json in the app folder
  console.log(chalk.green(`Creating a new Cycle.js app in ${appPath}.`))
  console.log()
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    packageJsonContent
  )
}
