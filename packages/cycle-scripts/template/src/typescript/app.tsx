module.exports = replacements => `${replacements.import}
${replacements.typeImport}
import { DOMSource, VNode } from '@cycle/dom'
import { Sources, Sinks } from './interfaces'

export type AppState = {
  count : number
}
export type AppReducer = (prevState : AppState) => AppState

const initalState : AppState = { count: 0 }

export function App({ DOM } : Sources) : Sinks {
  const action$ : ${replacements.streamType}<AppReducer> = intent(DOM)
  const model$ : ${replacements.streamType}<AppState> = model(action$)
  const vdom$ : ${replacements.streamType}<VNode> = view(model$)

  return {
    DOM: vdom$
  }
}

function intent(DOM : DOMSource) : ${replacements.streamType}<AppReducer> {
  const add$ = DOM.select('.add').events('click')
    .${replacements.mapTo}(prevState => ({ ...prevState, count: prevState.count + 1 }))

  const subtract$ = DOM.select('.subtract').events('click')
    .${replacements.mapTo}(prevState => ({ ...prevState, count: prevState.count - 1 }))

  return ${replacements.merge}(add$, subtract$)
}

function model(action$ : ${replacements.streamType}<AppReducer>) : ${replacements.streamType}<AppState> {
  return action$
    .${replacements.fold}((state, reducer) => reducer(state), initalState)
}

function view(state$ : ${replacements.streamType}<AppState>) : ${replacements.streamType}<VNode> {
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
