#!/usr/bin/env node

'use strict'

var spawn = require('cross-spawn')
var script = process.argv[2]
var args = process.argv.slice(3)

switch (script) {
  case 'start':
  case 'test':
  case 'build':
  case 'take-off-training-wheels':
    var result = spawn.sync(
      'node',
      [require.resolve('./scripts/' + script)].concat(args),
      {stdio: 'inherit'}
    )
    process.exit(result.status)
    break
  default:
    console.log('Unknown script "' + script + '".')
    console.log('Perhaps you need to upgrade cycle-scripts?')
    break
}
