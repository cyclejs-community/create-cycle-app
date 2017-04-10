module.exports = replacements => `${replacements.import}
import {Sources, Sinks} from './interfaces'

export function App(sources : Sources) : Sinks {
  const vtree$ = ${replacements.stream}.of(
    <div>My Awesome Cycle.js app</div>
  )

  return {
    DOM: vtree$
  }
}
`
