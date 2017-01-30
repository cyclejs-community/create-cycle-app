jest.mock('fs')
const fs = require('fs')
const isSafeToCreateProjectIn = require('../../src/isSafeToCreateProjectIn')
const whiteList = [
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
      const isSafe = isSafeToCreateProjectIn('./someFolder')
      expect(isSafe).toBe(false)
    })
  })

  describe('when calling it with a directory containing only white-listened files', () => {
    test('should return true', () => {
      fs.readdirSync.mockImplementation(() => whiteList)
      const isSafe = isSafeToCreateProjectIn('./someFolder')
      expect(isSafe).toBe(true)
    })
  })
})
