'use strict'

const path = require('path')

const packageRegex = /(@[\w-]+\/)?[\w-]+/

module.exports = function getPackageName (installPackage) {
  if (/.tgz$/.test(installPackage)) {
    return installPackage.match(/^(.*)-.*tgz$/)[1]
  } else if (/^\.\/|\//.test(installPackage)) {
    return require(path.resolve(installPackage, 'package.json')).name
  } else {
    return installPackage.match(packageRegex)[0]
  }
}
