'use strict'
var fs = require('fs')

module.exports = function isSafeToCreateProjectIn (appFolder) {
  var whitelist = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE'
  ]
  return fs.readdirSync(appFolder)
    .every(function (file) {
      return whitelist.indexOf(file) >= 0
    })
}
