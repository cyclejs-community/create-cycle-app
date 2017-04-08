'use strict'

const inquirer = require('inquirer')

const initQuestions = [
  {
    type: 'list',
    name: 'language',
    default: 0,
    choices: ['JavaScript', 'TypeScript'],
    message: 'Which language do you want to use to write your cycle app?'
  },
  {
    type: 'list',
    name: 'streamLib',
    default: 0,
    choices: [
      {
        name: 'XStream, tailored for Cycle.js',
        value: 'xstream'
      },
      {
        name: 'Most.js, a blazing fast stream library',
        value: 'most'
      },
      {
        name: 'RxJS',
        value: 'rxjs'
      }
    ],
    message: 'Which reactive stream library do you want to use?'
  }
]

module.exports = (flavor, cb) => {
  if (flavor) {
    return cb(false)
  }
  inquirer.prompt(initQuestions).then(answers => {
    return cb(answers)
  })
}
