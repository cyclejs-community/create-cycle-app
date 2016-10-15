import {run} from '--RUN-LIB--'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'
import {DriverFunction} from '@cycle/base'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app') as DriverFunction
}

run(main, drivers)
