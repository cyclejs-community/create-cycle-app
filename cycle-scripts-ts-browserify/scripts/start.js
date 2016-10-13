'use strict'

var path = require('path')
var budo = require('budo')
// var hotModuleReload = require('browserify-hmr')

require('dotenv').config({silent: true})

budo(path.join('src', 'index.ts'), {
  serve: 'bundle.js',
  dir: 'public',
  live: true,
  port: 8000,
  stream: process.stdout,
  browserifyArgs: '-p tsify -d --insert-globals -t [ envify --_ purge --NODE_ENV development ]'.split(' ')
})
