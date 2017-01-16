const eslint = require('@northbrook/eslint').plugin

module.exports = {
  'packages': [
    'create-cycle-app',
    'cycle-scripts-es-browserify',
    'cycle-scripts-ts-browserify',
    'cycle-scripts-es-webpack',
    'cycle-scripts-ts-webpack'
  ],
  'plugins': [
    'northbrook/plugins',
    eslint
  ],
  'eslint': {
    'directories': ['*/*.js']
  }
}
