'use strict'

const path = require('path')

module.exports = function getPackageName (installPackage) {
  if (/.tgz$/.test(installPackage)) {
    return installPackage.match(/^(.*)-.*tgz$/)[1]
  } else if (~installPackage.indexOf('@')) {
    return installPackage.split('@')[0]
  }
  return path.basename(installPackage)
}
