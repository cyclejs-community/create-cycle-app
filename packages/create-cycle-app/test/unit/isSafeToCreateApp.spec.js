jest.mock('fs')
const fs = require('fs')
const isSafeToCreateApp = require('../../src/isSafeToCreateApp')
const whiteList = [
  '.DS_Store',
  'Thumbs.db',
  '.git',
  '.gitignore',
  '.idea',
  'README.md',
  'LICENSE'
]

describe('isSafeToCreateApp module', () => {
  describe('when calling it with a directory containing files not white-listened', () => {
    test('should return false', () => {
      fs.readdirSync.mockImplementation(() => whiteList.concat('index.js'))
      const isSafe = isSafeToCreateApp('./someFolder')
      expect(isSafe).toBe(false)
    })
  })

  describe('when calling it with a directory containing only white-listened files', () => {
    test('should return true', () => {
      fs.readdirSync.mockImplementation(() => whiteList)
      const isSafe = isSafeToCreateApp('./someFolder')
      expect(isSafe).toBe(true)
    })
  })
})
