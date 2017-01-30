jest.mock('fs')
const fs = require('fs')
jest.mock('../../src/isSafeToCreateProjectIn')
const isSafeToCreateProjectIn = require('../../src/isSafeToCreateProjectIn')
const createProjectIn = require('../../src/createProjectIn')

describe('createProjectIn module', () => {
  describe('when calling it and the directory does not exist', () => {
    test('should create it', (done) => {
      fs.existsSync.mockImplementation(() => false)
      fs.mkdirSync.mockImplementation(() => {})
      createProjectIn('./appFolder')
      expect(fs.existsSync).toBeCalledWith('./appFolder')
      expect(fs.mkdirSync).toBeCalledWith('./appFolder')
      expect(isSafeToCreateProjectIn).not.toBeCalled()
      done()
    })
  })
})
