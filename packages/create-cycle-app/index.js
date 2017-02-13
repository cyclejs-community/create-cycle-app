#!/usr/bin/env node
'use strict'

const path = require('path')
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const createApp = require('./src/createApp')
const VERSION = require(path.resolve(__dirname, 'package.json')).version

const validCommands = {
  'verbose': true,
  'flavor': true
}

// Command line prelude (version and usage)
const commands = argv._
if (commands.length === 0) {
  if (argv.version) {
    console.log(chalk.green(`create-cycle-app version: ${VERSION}`))
    process.exit()
  }
  console.error(chalk.red('Usage: create-cycle-app <project-directory> [--flavor] [--verbose]'))
  process.exit(1)
}

Object.keys(argv)
  .filter(cmd => cmd !== '_')
  .every(cmd => {
    if (!validCommands[cmd]) {
      console.error(chalk.red(`Invalid command: ${cmd}`))
      process.exit(1)
      return false
    }
    return true
  })

const flavor = argv.flavor || 'cycle-scripts'
const verbose = argv.verbose || false
const name = commands[0]

// Parse the command line options and run the setup
createApp(name, verbose, flavor)
