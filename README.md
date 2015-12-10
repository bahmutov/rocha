# rocha (aka random mocha)

> Runs Mocha unit tests but randomizes their order

[![NPM][rocha-icon] ][rocha-url]

[![Build status][rocha-ci-image] ][rocha-ci-url]
[![dependencies][rocha-dependencies-image] ][rocha-dependencies-url]
[![devdependencies][rocha-devdependencies-image] ][rocha-devdependencies-url]

[![semantic-release][semantic-image] ][semantic-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)
[![standard style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Example

The tests in [spec/tricky-spec.js](spec/tricky-spec.js) always pass in Mocha,
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

This tests pass under Mocha but this is very unreliable: a tiny code change
can break the tests for no obvious reason. A pain to find the problem too.

### Running tests using Mocha

    > mocha spec/tricky-spec.js
      example
    polluted the environment
        ✓ runs test 1
        ✓ runs test 2
        ✓ runs test 3
      3 passing (8ms)

### Running tests using Rocha

    > rocha spec/tricky-spec.js
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

## How should we code?

Each unit test should NOT depend on the order of other tests to run. In the above case,
refactor the test to reset the variable before each unit test,
see [spec/fixed.spec.js](spec/fixed.spec.js)

```js
describe('fixed example', function () {
  var foo
  beforeEach(function () {
    foo = undefined
  })
  ...
});
```

Now each unit test starts from the same values (at least in this example).

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/rocha/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[rocha-icon]: https://nodei.co/npm/rocha.png?downloads=true
[rocha-url]: https://npmjs.org/package/rocha
[rocha-ci-image]: https://travis-ci.org/bahmutov/rocha.png?branch=master
[rocha-ci-url]: https://travis-ci.org/bahmutov/rocha
[rocha-dependencies-image]: https://david-dm.org/bahmutov/rocha.png
[rocha-dependencies-url]: https://david-dm.org/bahmutov/rocha
[rocha-devdependencies-image]: https://david-dm.org/bahmutov/rocha/dev-status.png
[rocha-devdependencies-url]: https://david-dm.org/bahmutov/rocha#info=devDependencies
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
