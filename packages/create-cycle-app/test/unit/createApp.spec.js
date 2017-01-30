jest.mock('../../src/preparePackageJson')
const preparePackageJson = require('../../src/preparePackageJson')
jest.mock('../../src/createProjectIn')
const createProjectIn = require('../../src/createProjectIn')
jest.mock('../../src/installScripts')

const createApp = require('../../src/createApp')

describe('createApp module', () => {
  describe('when calling it', () => {
    test('should create project dir, prepare package.json and install scripts', () => {
      createApp('test')
      expect(createProjectIn.mock.calls[0][0]).toContain('/packages/create-cycle-app/test')
      expect(preparePackageJson.mock.calls[0][0]).toContain('/packages/create-cycle-app/test')
      expect(preparePackageJson.mock.calls[0][1]).toBe('test')
      expect(preparePackageJson.mock.calls[0][2].toString()).toContain('installScripts(appFolder, appName, flavor, verbose)')
    })
  })
})
