jest.mock('fs')
const fs = require('fs')
jest.mock('../../src/isSafeToCreateApp')
const isSafeToCreateApp = require('../../src/isSafeToCreateApp')

const createAppDir = require('../../src/createAppDir')

describe('createAppDir module', () => {
  afterEach(() => {
    fs.existsSync.mockClear()
    isSafeToCreateApp.mockClear()
  })

  describe('when calling it and the directory does not exist', () => {
    test('should create it', (done) => {
      fs.existsSync.mockReturnValue(false)
      createAppDir('./appFolder')
      expect(fs.existsSync).toBeCalledWith('./appFolder')
      expect(fs.mkdirSync).toBeCalledWith('./appFolder')
      expect(isSafeToCreateApp).not.toBeCalled()
      done()
    })
  })
})
