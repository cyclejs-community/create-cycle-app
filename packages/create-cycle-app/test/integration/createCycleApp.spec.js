const fs = require('fs-extra')
const path = require('path')
const appName = path.resolve(__dirname, 'MYCYCLEAPP')
const spawn = require('cross-spawn')

describe('create-cycle-app', () => {
  afterEach(() => {
    fs.removeSync(appName)
  })
  beforeEach((done) => {
    spawn.sync('node', [
      path.resolve(__dirname, '../../index.js'),
      appName
    ])
    done()
  })
  test('', () => {
    const dir = fs.readdirSync(appName)
    expect(dir).toMatchObject([
      '.gitignore',
      'node_modules',
      'package.json',
      'public',
      'src'
    ])
    expect(fs.readFileSync(path.join(appName, 'package.json'), 'UTF8')).toMatchSnapshot()
  })
})
