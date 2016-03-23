/* global describe, it */

describe('tricky describe example', function () {
  var foo
  describe('in environment 1', function () {
    it('runs a test', function () {
      foo = 42
      console.log('polluted the environment')
    })
  })
  describe('in environment 2', function () {
    it('runs a test', function () {
      console.assert(foo === 42, 'foo is 42', foo)
    })
  })
})
