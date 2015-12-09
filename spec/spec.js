/* global describe, it */
describe('example', function () {
  var foo
  it('runs test 1', function () {
    foo = 42
    console.log('polluted the environment')
  })
  it('runs test 2', function () {})
  it('runs test 3', function () {
    console.assert(foo === 42, 'foo is 42', foo)
  })
})
