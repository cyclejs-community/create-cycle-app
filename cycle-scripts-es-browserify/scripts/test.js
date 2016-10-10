'use strict'

var path = require('path')
var spawn = require('cross-spawn')

var mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'mocha')

var args = [
  '--colors',
  '--require',
  'babel-register',
  !process.env.CI && '--watch',
  '**/*.test.js'
].filter(Boolean)

spawn(mocha, args, {stdio: 'inherit'})
