'use strict'

var path = require('path')
var spawn = require('cross-spawn')

var args = [
  '--colors',
  '--require',
  'babel-register',
  !process.env.CI && '--watch',
  '**/*.test.js'
].filter(Boolean)

spawn(path.resolve(__dirname, '..', 'node_modules', '.bin', 'mocha'), args, {stdio: 'inherit'})
