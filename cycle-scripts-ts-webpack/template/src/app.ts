import {VNode, div} from '@cycle/dom'
import {DOMSource} from '@cycle/dom/--DOM-TYPINGS--'
--IMPORT--

export type Sources = {
  DOM: DOMSource
}

export type Sinks = {
  DOM: --STREAM-TYPE--<VNode>
}

export function App (sources: Sources): Sinks {
  const vtree$ = --STREAM--.of(
    div('My Awesome Cycle.js app')
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
