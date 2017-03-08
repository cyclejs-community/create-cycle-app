'use strict'

module.exports = {
  host: 'localhost',
  port: 8000,
  inline: true,
  historyApiFallback: true,
  hot: true,
  // stats: 'errors-only'
  clientLogLevel: 'none',
  compress: true,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/
  }
}
