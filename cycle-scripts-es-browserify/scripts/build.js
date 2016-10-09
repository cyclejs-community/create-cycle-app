var fs = require('fs')
var {join} = require('path')
var browserify = require('browserify')
var babelify = require('babelify')

browserify(join('src', 'index.js'))
  .transform(
    babelify.configure({
      presets: ['es2015']
    })
  )
  .bundle()
  .pipe(fs.createWriteStream(join('build', 'bundle.js')))
