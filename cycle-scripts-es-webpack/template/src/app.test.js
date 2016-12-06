<% if (test === 'mocha') { %>
import assert from 'assert'

describe('App', function () {
  it('should test something', function () {
    // TODO: Add your tests here
  })
})
<% } %>
<% if (test === 'ava') { %>
import test from 'ava'

test('test something', t => {
  t.deepEqual({a: 0}, {a: 0})
})
<% } %>