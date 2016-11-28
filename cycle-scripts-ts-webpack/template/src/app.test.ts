<% if (test === 'mocha') { %>
import * as assert from 'assert'

describe('App', () => {
  it('should test something', () => {
    // TODO: Add your tests here
  })
})
<% } %>
<% if (test === 'ava') { %>
import * as test from 'ava'

test('test something', t => {
  t.deepEqual({a: 0}, {a: 0})
})
<% } %>
