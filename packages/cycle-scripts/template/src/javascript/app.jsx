module.exports = replacements => `${replacements.import}

export function App (sources) {
  const vtree$ = ${replacements.stream}.of(
    <div>My Awesome Cycle.js app</div>
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
`
