var getPackageName = require('../../src/getPackageName')

describe('getPackageName module', function () {
  test('should return the unaltered package name if alrady given it', function () {
    expect(getPackageName('cycle-scripts')).toBe('cycle-scripts')
  })
  // TODO: complete tests
})
