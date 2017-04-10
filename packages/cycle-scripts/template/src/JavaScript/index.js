module.exports = replacements => `import {run} from '${replacements.run}'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'

const main = App

const drivers = {
  DOM: makeDOMDriver('#root')
}

run(main, drivers)
`
