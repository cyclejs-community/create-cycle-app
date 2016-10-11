'use strict'

var path = require('path')
var spawn = require('cross-spawn')
// var chalk = require('chalk')
var glob = require('glob')

var tsc = path.resolve(process.cwd(), 'node_modules', '.bin', 'tsc')
var mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'mocha')

var args = [
  '--colors',
  // !process.env.CI && (console.log(chalk.green.bold('Enabling watch mode')) || '--watch'),
  'test/**/*.test.js'
].filter(Boolean)

spawn.sync(tsc, ['--outDir', 'test', glob.sync('src/**/*.test.ts')], {stdio: 'inherit'})
spawn.sync(mocha, args, {stdio: 'inherit'})
