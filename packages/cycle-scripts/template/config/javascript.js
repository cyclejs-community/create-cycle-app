module.exports = {
  xstream: {
    run: '@cycle/run',
    import: 'import xs from \'xstream\'',
    stream: 'xs',
    fold: 'fold',
    merge: 'xs.merge',
    mapTo: 'mapTo'
  },
  rxjs: {
    run: '@cycle/rxjs-run',
    import: 'import Rx from \'rxjs/Rx\'',
    stream: 'Rx.Observable',
    fold: 'scan',
    merge: 'Rx.Observable.merge',
    mapTo: 'mapTo'
  },
  most: {
    run: '@cycle/most-run',
    import: 'import * as most from \'most\'',
    stream: 'most',
    fold: 'scan',
    merge: 'most.merge',
    mapTo: 'constant'
  }
}
