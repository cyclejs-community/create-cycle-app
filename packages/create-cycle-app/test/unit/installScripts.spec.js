const path = require('path')
jest.mock('cross-spawn')
const spawn = require('cross-spawn')
spawn.mockImplementation(() => ({ on: jest.fn() }))
jest.mock('../../src/getPackageName')
const getPackageName = require('../../src/getPackageName')
jest.mock('console')
const consoleMock = require('console')
const installScripts = require('../../src/installScripts')
// installScripts(appFolder, appName, { flavor, verbose, answers: false })
describe('installScripts module', () => {
  test('should be a function with arity 3', () => {
    expect(typeof installScripts).toBe('function')
    expect(installScripts.length).toBe(3)
  })

  describe('when invoked with a flavor published on npm', () => {
    getPackageName.mockImplementation(name => name)
    installScripts('./', 'appName', { flavor: 'cycle-scripts', cli: 'npm' })

    test('should call getPackageName with the name of the npm module', () => {
      expect(getPackageName).toBeCalledWith('cycle-scripts')
    })

    test('should call spawn with the correct arguments', () => {
      expect(spawn).toBeCalledWith(
        'npm',
        [
          'install',
          '--save-dev',
          '--save-exact',
          'cycle-scripts'
        ],
        {'cwd': './', 'stdio': 'inherit'}
      )
    })

    test('should console log the correct information', () => {
      expect(consoleMock.log.mock.calls[0][0]).toContain(
        'Installing packages. This might take a couple minutes.',
      )
      expect(consoleMock.log.mock.calls[1][0]).toContain(
        'Installing cycle-scripts from npm ...',
      )
      expect(consoleMock.log.mock.calls[2][0]).toBe()
    })
  })

  describe('when invoked with a local flavor', () => {
    getPackageName.mockImplementation(name => path.basename(name))
    installScripts('./', 'appName', { flavor: './cycle-scripts', cli: 'npm' })

    test('should console log the correct information', () => {
      expect(consoleMock.log.mock.calls[4][0]).toContain(
        'Installing cycle-scripts from local',
      )
    })

    test('should call spawn with the correct arguments', () => {
      expect(spawn.mock.calls[1][1][3]).toContain('./cycle-scripts')
    })
  })

  describe('when invoked with a verbose flag', () => {
    getPackageName.mockImplementation(name => name)
    installScripts('./', 'appName', { flavor: 'cycle-scripts', verbose: true, cli: 'npm' })

    test('should call spawn with the correct arguments', () => {
      expect(spawn.mock.calls[2]).toMatchObject([
        'npm',
        [
          'install',
          '--verbose',
          '--save-dev',
          '--save-exact',
          'cycle-scripts'
        ],
        {'cwd': './', 'stdio': 'inherit'}
      ])
    })
  })
})
