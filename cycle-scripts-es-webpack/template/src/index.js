import {run} from '--RUN-LIB--'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
