#!/usr/bin/env node
'use strict'

var path = require('path')
var chalk = require('chalk')
var argv = require('minimist')(process.argv.slice(2))
var VERSION = require(path.resolve(__dirname, 'package.json')).version

var createApp = require('./src/createApp')

// Command line prelude (version and usage)
var commands = argv._
if (commands.length === 0) {
  if (argv.version) {
    console.log(chalk.green('create-cycle-app version: ' + VERSION))
    process.exit()
  }
  console.error(chalk.red('Usage: create-cycle-app <project-directory> [--flavor] [--verbose]'))
  process.exit(1)
}
// Parse the command line options and run the setup
createApp(commands[0], argv.verbose, argv.flavor)

