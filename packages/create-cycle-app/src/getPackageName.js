'use strict'
var path = require('path')

module.exports = function getPackageName (installPackage) {
  if (~installPackage.indexOf('.tgz')) {
    return installPackage.match(/^.+\/(.+)-.+\.tgz$/)[1]
  } else if (~installPackage.indexOf('@')) {
    return installPackage.split('@')[0]
  }
  return path.basename(installPackage)
}
