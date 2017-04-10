const dependencies = {
  basics: [
    '@cycle/dom@17.1.0'
  ],
  streamLib: {
    xstream: [
      '@cycle/run@3.1.0',
      'xstream@10.5.0'
    ],
    rxjs: [
      '@cycle/rxjs-run@7.0.0',
      'rxjs@5.3.0'
    ],
    most: [
      '@cycle/most-run@7.1.0',
      'most@1.2.2'
    ]
  }
}

const replacements = {
  xstream: {
    run: '@cycle/run',
    import: 'import xs from \'xstream\'',
    typeImport: 'import {Stream} from \'xstream\'',
    stream: 'xs',
    streamType: 'Stream'
  },
  rxjs: {
    run: '@cycle/rxjs-run',
    import: 'import Rx from \'rxjs/Rx\'',
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

module.exports = {
  dependencies,
  replacements
}
