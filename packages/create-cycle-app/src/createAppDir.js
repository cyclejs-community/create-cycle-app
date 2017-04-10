'use strict'

const chalk = require('chalk')
const console = require('console')
const fs = require('fs')

const isSafeToCreateApp = require('./isSafeToCreateApp')

module.exports = function createProjectIn (appPath) {
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath)
    return
  }

  if (isSafeToCreateApp(appPath)) {
    return
  } else {
    console.log(chalk.red(`The directory \`${appPath}\` contains file(s) that could conflict. Aborting.`))
    process.exit(1)
  }
}
