jest.mock('fs')
var fs = require('fs')
var isSafeToCreateProjectIn = require('../../src/isSafeToCreateProjectIn')
var whiteList = [
  '.DS_Store',
  'Thumbs.db',
  '.git',
  '.gitignore',
  '.idea',
  'README.md',
  'LICENSE'
]

describe('isSafeToCreateProjectIn module', () => {
  describe('when calling it with a directory containing files not white-listened', () => {
    test('should return false', () => {
      fs.readdirSync.mockImplementation(() => whiteList.concat('index.js'))
      var isSafe = isSafeToCreateProjectIn('./someFolder')
      expect(isSafe).toBe(false)
    })
  })

  describe('when calling it with a directory containing only white-listened files', () => {
    test('should return true', () => {
      fs.readdirSync.mockImplementation(() => whiteList)
      var isSafe = isSafeToCreateProjectIn('./someFolder')
      expect(isSafe).toBe(true)
    })
  })
})
