import {div} from '@cycle/dom'
--IMPORT--

export function App (sources) {
  const vtree$ = --STREAM--.of(
    div('My Awesome Cycle.js app')
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
