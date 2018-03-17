# rocha (aka "ROKKA" the Random Mocha)

> Runs Mocha unit tests but randomizes their order

[![NPM][rocha-icon] ][rocha-url]

[![Build status][rocha-ci-image] ][rocha-ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)
[![standard style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![renovate-app badge][renovate-badge]][renovate-app]

**E2E tests**

`rocha-test` - [![Build Status](https://travis-ci.org/bahmutov/rocha-test.svg?branch=master)](https://travis-ci.org/bahmutov/rocha-test)

## Install and use

Should be just like [Mocha](https://mochajs.org/) for most cases

    npm install -g rocha
    rocha src/*-spec.js

Open an [issue][issues] if things do not work as expected.

Because I used some pieces of ES6, and Ubuntu does not play nicely with `--harmony`
flag (which allows [using some ES6 today](https://glebbahmutov.com/blog/using-node-es6-today/))
this package requires Node >= 4.

## Demo screencast

[![asciicast](https://asciinema.org/a/31549.png)](https://asciinema.org/a/31549)

In this demo I am showing how Rocha can find ordering problems in the tests (see the example below).

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

Rocha takes each suite and shuffles its list of unit tests. Given enough test runs this should
make visible the problems due to shared data, or polluted environment, or even poor understanding of
JavaScript [concurrency](http://glebbahmutov.com/blog/concurrency-can-bite-you-even-in-node/).

## Notes

Not every random order will be

- so random that it is different from sequential
- enough to flush out every problem

## Recreating the failed order

If the unit tests fail, **the executed order is saved** in JSON file `.rocha.json`.
For the included example `rocha spec/*-spec.js` it will be something like this

    [{
      "title": "fixed example",
      "tests": [
        "runs test 1",
        "runs test 2",
        "runs test 3"
      ]
    }, {
      "title": "tricky example",
      "tests": [
        "runs test 1",
        "runs test 3",
        "runs test 2"
      ]
    }]

When you start `rocha` again, it will find this file and will reorder the tests
**in the same order**, recreating the failure again.

If the tests pass, the `.rocha.json` file is deleted, thus the next run will be random again.

## How should we test?

Each unit test should NOT depend on the order the other tests are running. In the above case,
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

## Options

**verbose log** - to see diagnostic messages as Rocha runs, set environment variable `DEBUG=rocha`
when running.

    DEBUG=rocha rocha <spec>

During end to end tests, verbose logging is enabled using `DEBUG=rocha:e2e`

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue][issues] on Github

[issues]: https://github.com/bahmutov/rocha/issues

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

[rocha-icon]: https://nodei.co/npm/rocha.svg?downloads=true
[rocha-url]: https://npmjs.org/package/rocha
[rocha-ci-image]: https://travis-ci.org/bahmutov/rocha.svg?branch=master
[rocha-ci-url]: https://travis-ci.org/bahmutov/rocha
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
