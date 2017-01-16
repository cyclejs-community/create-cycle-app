var installScripts = require('../../src/installScripts')

installScripts = jest.fn(function () { return 1 })

describe('installScripts module', function () {
  test('should...', function () {
    installScripts('test', 'appName', 'cycle-scripts')
    expect(installScripts()).toBe(1)
  })
  // TODO: complete tests
})
