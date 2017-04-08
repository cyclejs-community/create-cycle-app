const initQuestions = require('../../src/initQuestions')
jest.mock('inquirer')
const inquirer = require('inquirer')

describe('initQuedstion module', () => {
  describe('when calling it', () => {
    test('should not prompt for question if a custom flavor is provided', () => {
      const callback = jest.fn()
      initQuestions('customFlavor', callback)
      expect(callback).toBeCalledWith(false)
      expect(inquirer.prompt).not.toBeCalled()
    })
    test('should prompt for question if no custom flavor is provided', () => {
      const callback = jest.fn()
      const answer = {language: 'javascript', streamLib: 'xstream'}
      inquirer.prompt.mockReturnValue({
        then: jest.fn(answers => callback(answer))
      })
      initQuestions(undefined, callback)
      expect(callback).toBeCalledWith(answer)
      expect(inquirer.prompt).toBeCalled()
    })
  })
})
