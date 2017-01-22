'use strict'
const fs = require('fs')

module.exports = function isSafeToCreateProjectIn (appFolder) {
  const whitelist = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE'
  ]
  return fs.readdirSync(appFolder)
    .every((file) => {
      return whitelist.indexOf(file) >= 0
    })
}
