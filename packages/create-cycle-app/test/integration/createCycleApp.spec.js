const fs = require('fs-extra')
const path = require('path')
const appName = path.resolve(__dirname, 'MYCYCLEAPP')
const spawn = require('cross-spawn')

describe('create-cycle-app', () => {
  describe('when invoked with the wrong arguments', () => {
    test('should throw an error', () => {
      expect(
        spawn.sync('node', [
          path.resolve(__dirname, '../../index.js'),
          appName,
          '--flavour',
          'cycle-scripts@1.0.3'
        ])
      ).toThrowError()
    })

    test('should throw an error', () => {
      expect(
        spawn.sync('node', [
          path.resolve(__dirname, '../../index.js'),
          appName,
          '--verbos'
        ])
      ).toThrowError()
    })
  })

  describe('when invoked with the the correct arguments', () => {
    let dir

    beforeEach((done) => {
      spawn.sync('node', [
        path.resolve(__dirname, '../../index.js'),
        appName,
        '--flavor',
        'cycle-scripts@1.0.3'
      ])
      dir = fs.readdirSync(appName)
      done()
    })

    afterEach(() => {
      fs.removeSync(appName)
    })

    test('it generate the correct folder structure and install dependencies', () => {
      expect(dir).toMatchObject([
        '.gitignore',
        'node_modules',
        'package.json',
        'public',
        'src'
      ])
    })

    test('it generate a correct package.json file', () => {
      expect(fs.readFileSync(path.join(appName, 'package.json'), 'UTF8')).toMatchSnapshot()
    })
  })
})
