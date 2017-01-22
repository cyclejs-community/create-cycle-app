var getPackageName = require('../../src/getPackageName')

describe('getPackageName module', function () {
  test('should return the unaltered package name if alrady given', function () {
    expect(getPackageName('cycle-scripts')).toBe('cycle-scripts')
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
    expect(getPackageName('@module/sub')).toBe('module')
  })
  test('should return the correct package name if inside a .tgz', function () {
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
  })
  test('should return the correct package name if uses a @/ naming', function () {
    expect(getPackageName('@module/sub')).toBe('module')
  })
})
