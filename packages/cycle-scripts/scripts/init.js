const questions = require('./init/questions')
const setup = require('./init/setup')

module.exports = function init (appPath, appName, options) {
  if (options.answers) {
    return setup(appPath, appName, options)
  }
  return questions(answers => {
    options.answers = answers
    setup(appPath, appName, options)
  })
}
