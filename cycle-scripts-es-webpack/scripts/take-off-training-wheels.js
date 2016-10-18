'use strict'

var fs = require('fs-extra')
var path = require('path')
var mkdirp = require('mkdirp')

var ownPackageJsonPath = path.resolve(__dirname, '..', 'package.json')
var appPackageJsonPath = path.join(process.cwd(), 'package.json')
var ownPackageJson = JSON.parse(fs.readFileSync(ownPackageJsonPath))
var appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath))
var scriptsPath = path.join(process.cwd(), '.scripts')

// Declaring new scripts
var scripts = {
  start: 'node .scripts/start.js',
  test: 'node .scripts/test.js',
  build: 'node .scripts/build.js'
}

// Declare the new dependencies, excluding self
var devDependencies = {}
Object.keys(appPackageJson.devDependencies)
  .filter(function (dep) { return dep !== ownPackageJson.name })
  .forEach(function (dep) {
    devDependencies[dep] = appPackageJson.devDependencies[dep]
  })
devDependencies = Object.assign({}, devDependencies, ownPackageJson.dependencies)

// Delete babel config in package.json
delete appPackageJson.babel

// Write the new package.json
var newPackageJson = Object.assign({}, appPackageJson, {scripts: scripts, devDependencies: devDependencies})
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newPackageJson, null, 2)
)

mkdirp(scriptsPath, function () {
  function copy (script, subDir, inRoot) {
    subDir = subDir || ''
    fs.copySync(path.join(__dirname, subDir, script), path.join(inRoot ? '' : scriptsPath, script))
  }

  // Copy scripts
  copy('start.js')
  copy('test.js')
  copy('build.js')

  // Copy configs
  copy('.babelrc', 'configs', true)
})

