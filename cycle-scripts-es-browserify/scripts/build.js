'use strict'

var fs = require('fs-extra')
var {join} = require('path')
var mkdirp = require('mkdirp')
var browserify = require('browserify')
var babelify = require('babelify')
var envify = require('envify/custom')
var exorcist = require('exorcist')

require('dotenv').config({silent: true})

var buildPath = join(process.cwd(), 'build')
var publicPath = join(process.cwd(), 'public')
var srcPath = join(process.cwd(), 'src')

mkdirp.sync(buildPath)

fs.copySync(publicPath, buildPath)

browserify(join(srcPath, 'index.js'), {debug: true})
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
  .pipe(exorcist(join(buildPath, 'bundle.js.map')))
  .pipe(fs.createWriteStream(join(buildPath, 'bundle.js')))
