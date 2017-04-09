'use strict'

const fs = require('fs')

module.exports = function isSafeToCreateApp (appFolder) {
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
