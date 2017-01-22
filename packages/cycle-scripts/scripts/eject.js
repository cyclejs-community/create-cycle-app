'use strict'

const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')

const ownPackageJsonPath = path.resolve(__dirname, '..', 'package.json')
const appPackageJsonPath = path.join(process.cwd(), 'package.json')
const ownPackageJson = JSON.parse(fs.readFileSync(ownPackageJsonPath))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath))
const scriptsPath = path.join(process.cwd(), '.scripts')

// Declaring new scripts
const scripts = {
  start: 'node .scripts/start.js',
  test: 'node .scripts/test.js',
  build: 'node .scripts/build.js'
}

// Declare the new dependencies, excluding self
let devDependencies = {}
Object.keys(appPackageJson.devDependencies)
  .filter(dep => { return dep !== ownPackageJson.name })
  .forEach(dep => {
    devDependencies[dep] = appPackageJson.devDependencies[dep]
  })
devDependencies = Object.assign({}, devDependencies, ownPackageJson.dependencies)

// Delete babel config in package.json
delete appPackageJson.babel

// Write the new package.json
const newPackageJson = Object.assign({}, appPackageJson, {scripts: scripts, devDependencies: devDependencies})
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newPackageJson, null, 2)
)

mkdirp(scriptsPath, () => {
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

