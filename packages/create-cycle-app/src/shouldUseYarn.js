const execSync = require('child_process').execSync

module.exports = function shouldUseYarn () {
  try {
    execSync('npm --version', { stdio: 'ignore' })
    return false
  } catch (e) {
    return true
  }
}
