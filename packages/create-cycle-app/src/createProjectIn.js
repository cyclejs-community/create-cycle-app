'use strict'
const fs = require('fs')
const chalk = require('chalk')
const isSafeToCreateProjectIn = require('./isSafeToCreateProjectIn')

module.exports = function createProjectIn (appFolder) {
  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
    return
  }

  if (isSafeToCreateProjectIn(appFolder)) {
    return
  } else {
    console.log(chalk.red(`The directory \`${appFolder}\` contains file(s) that could conflict. Aborting.`))
    process.exit(1)
  }
}
