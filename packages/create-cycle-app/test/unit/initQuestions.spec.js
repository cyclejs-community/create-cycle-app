const initQuestions = require('../../src/initQuestions')
jest.mock('inquirer')
const inquirer = require('inquirer')

describe('initQuedstion module', () => {
  describe('when calling it', () => {
    test('should prompt for question', () => {
      const callback = jest.fn()
      const answer = {language: 'javascript', streamLib: 'xstream'}
      inquirer.prompt.mockReturnValue({
        then: jest.fn(answers => callback(answer))
      })
      initQuestions(callback)
      expect(callback).toBeCalledWith(answer)
      expect(inquirer.prompt).toBeCalled()
    })
  })
})
