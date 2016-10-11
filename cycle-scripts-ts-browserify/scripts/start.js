'use strict'

var path = require('path')
var budo = require('budo')
var tsify = require('tsify')
// var envify = require('envify/custom')
// var hotModuleReload = require('browserify-hmr')

// require('dotenv').config({silent: true})

budo(path.join('src', 'index.ts'), {
  serve: 'bundle.js',
  dir: 'public',
  live: true,
  port: 8000,
  stream: process.stdout,
  browserify: {
    plugin: [
      // hotModuleReload,
      tsify
    ],
    debug: true,
    insertGlobals: true
    // transform: [
    //   envify(Object.assign({}, process.env, {
    //     _: 'purge',
    //     NODE_ENV: 'development'
    //   }))
    // ]
  }
})
