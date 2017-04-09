const createPackageJson = require('../../src/createPackageJson')
jest.mock('fs')
const fs = require('fs')
jest.mock('console')
const console = require('console')
const chalk = require('chalk')

describe('createPackageJson module', () => {
  describe('when calling it', () => {
    test('should correctly prepare package.json and write it to disk', () => {
      createPackageJson('testPath', 'testName')

      expect(fs.writeFileSync.mock.calls[0][0]).toBe('testPath/package.json')
      expect(fs.writeFileSync.mock.calls[0][1]).toBe(JSON.stringify({
        name: 'testName',
        version: '0.1.0',
        private: true
      }, null, 2))
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenCalledWith(chalk.green('Creating a new Cycle.js app in testPath.'))
    })
  })
})
