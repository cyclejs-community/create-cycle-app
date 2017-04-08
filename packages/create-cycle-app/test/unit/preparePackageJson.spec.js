const preparePackageJson = require('../../src/preparePackageJson')
jest.mock('fs')
const fs = require('fs')

describe('preparePackageJson module', () => {
  describe('when calling it', () => {
    test('should correctly prepare package.json and write it to disk', () => {
      const callback = jest.fn()
      preparePackageJson('testPath', 'testName', callback)

      expect(fs.writeFileSync.mock.calls[0][0]).toBe('testPath/package.json')
      expect(fs.writeFileSync.mock.calls[0][1]).toBe(JSON.stringify({
        name: 'testName',
        version: '0.1.0',
        private: true
      }, null, 2))
      expect(callback).toBeCalled()
    })
  })
})
