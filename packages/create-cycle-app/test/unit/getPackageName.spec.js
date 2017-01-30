const getPackageName = require('../../src/getPackageName')

describe('getPackageName module', () => {
  test('should return the unaltered package name if alrady given', () => {
    expect(getPackageName('cycle-scripts')).toBe('cycle-scripts')
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
    expect(getPackageName('cycle-scripts@next')).toBe('cycle-scripts')
  })
  test('should return the correct package name if inside a .tgz', () => {
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
  })
  test('should return the correct package name if uses a @/ naming', () => {
    expect(getPackageName('cycle-scripts@next')).toBe('cycle-scripts')
  })
})
