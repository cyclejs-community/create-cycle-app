'use strict'

var fs = require('fs-extra')
var path = require('path')
var mkdirp = require('mkdirp')
var browserify = require('browserify')
var tsify = require('tsify')
var envify = require('envify/custom')
var exorcist = require('exorcist')

require('dotenv').config({silent: true})

var srcPath = path.join(process.cwd(), 'src')
var buildPath = path.join(process.cwd(), 'build')
var publicPath = path.join(process.cwd(), 'public')

mkdirp.sync(buildPath)

// Copy static assets
fs.copySync(publicPath, buildPath)

// Bundle js
browserify(path.join(srcPath, 'index.ts'), {debug: true})
  .plugin(tsify)
  .transform(
    envify(Object.assign({}, process.env, {
      _: 'purge',
      NODE_ENV: 'production'
    }))
  )
  .transform('uglifyify')
  .bundle()
  .pipe(exorcist(path.join(buildPath, 'bundle.js.map')))
  .pipe(fs.createWriteStream(path.join(buildPath, 'bundle.js')))
