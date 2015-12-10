/* global describe, beforeEach, it */
describe('fixed example', function () {
  var foo
  beforeEach(function () {
    foo = undefined
  })
  it('runs test 1', function () {
    foo = 42
    console.log('polluted the environment')
  })
  it('runs test 2', function () {})
  it('runs test 3', function () {
    console.assert(foo !== 42, 'foo is not 42', foo)
  })
})
