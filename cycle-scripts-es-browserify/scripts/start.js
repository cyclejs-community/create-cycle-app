var {join} = require('path')
var budo = require('budo')
var babelify = require('babelify')
// var hotModuleReload = require('browserify-hmr')

budo(join('src', 'index.js'), {
  serve: 'bundle.js',
  dir: 'public',
  live: '*.{css,html}',
  port: 8000,
  stream: process.stdout,
  browserify: {
    // plugin: hotModuleReload,
    transform: babelify.configure({
      presets: ['es2015']
    })
  }
})
