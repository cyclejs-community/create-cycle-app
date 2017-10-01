module.exports = replacements => `${replacements.import}

const initalState = { count: 0 }

export function App (sources) {
  const action$ = intent(sources.DOM)
  const model$ = model(action$)
  const vdom$ = view(model$)

  const sinks = {
    DOM: vdom$
  }
  return sinks
}

function intent(DOM) {
  const add$ = DOM.select('.add').events('click')
    .${replacements.mapTo}(prevState => ({ ...prevState, count: prevState.count + 1 }))

  const subtract$ = DOM.select('.subtract').events('click')
    .${replacements.mapTo}(prevState => ({ ...prevState, count: prevState.count - 1 }))

  return ${replacements.merge}(add$, subtract$)
}

function model(action$) {
  return action$
    .${replacements.fold}((state, reducer) => reducer(state), initalState)
}

function view(state$) {
  return state$
    .map(s => s.count)
    .map(count =>
      <div>
        <h2>My Awesome Cycle.js app</h2>
        <span>{ 'Counter: ' + count }</span>
        <button type='button' className='add'>Increase</button>
        <button type='button' className='subtract'>Decrease</button>
      </div>
    )
}
`
