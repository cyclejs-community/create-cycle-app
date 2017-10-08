module.exports = {
  xstream: {
    run: '@cycle/run',
    import: 'import xs from \'xstream\'',
    typeImport: 'import {Stream} from \'xstream\'',
    stream: 'xs',
    streamType: 'Stream'
  },
  rxjs: {
    run: '@cycle/rxjs-run',
    import: 'import * as Rx from \'rxjs\'',
    typeImport: 'import {Observable} from \'rxjs\'',
    stream: 'Rx.Observable',
    streamType: 'Observable'
  },
  most: {
    run: '@cycle/most-run',
    import: 'import * as most from \'most\'',
    typeImport: 'import {Stream} from \'most\'',
    stream: 'most',
    streamType: 'Stream'
  }
}
