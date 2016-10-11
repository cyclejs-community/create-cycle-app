'use strict'

var fs = require('fs-extra')
var path = require('path')
var mkdirp = require('mkdirp')
var browserify = require('browserify')
var babelify = require('babelify')
var envify = require('envify/custom')
var exorcist = require('exorcist')

require('dotenv').config({silent: true})

var buildPath = path.join(process.cwd(), 'build')
var publicPath = path.join(process.cwd(), 'public')
var srcPath = path.join(process.cwd(), 'src')

mkdirp.sync(buildPath)

fs.copySync(publicPath, buildPath)

browserify(path.join(srcPath, 'index.js'), {debug: true})
  .transform(
    babelify.configure({
      presets: ['es2015'],
      sourceMaps: true
    })
  )
  .transform(
    envify(Object.assign({}, process.env, {
      _: 'purge',
      NODE_ENV: 'production'
    }))
  )
  .transform('uglifyify', {global: true})
  .bundle()
  .pipe(exorcist(path.join(buildPath, 'bundle.js.map')))
  .pipe(fs.createWriteStream(path.join(buildPath, 'bundle.js')))
