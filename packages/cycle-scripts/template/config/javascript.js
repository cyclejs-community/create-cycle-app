module.exports = {
  xstream: {
    run: '@cycle/run',
    import: 'import xs from \'xstream\'',
    stream: 'xs'
  },
  rxjs: {
    run: '@cycle/rxjs-run',
    import: 'import Rx from \'rxjs/Rx\'',
    stream: 'Rx.Observable'
  },
  most: {
    run: '@cycle/most-run',
    import: 'import * as most from \'most\'',
    stream: 'most'
  }
}
