# rocha (aka random mocha)

> Runs Mocha unit tests but randomizes their order

[![standard style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Example

The tests in [spec/spec.js](spec/spec.js) always pass in Mocha,
but only because their execution order is 1 - 2 - 3.

```js
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
```

### Running tests using Mocha

    > mocha spec/spec.js
      example
    polluted the environment
        ✓ runs test 1
        ✓ runs test 2
        ✓ runs test 3
      3 passing (8ms)

### Running tests using rocha

    shuffling 3 unit tests in "example"
      example
        1) runs test 3
    polluted the environment
        ✓ runs test 1
        ✓ runs test 2
      2 passing (10ms)
      1 failing
      1) example runs test 3:
          AssertionError: foo is 42 undefined

Not every random order will be

- so random that it is different from sequential
- enough to flush out every problem

