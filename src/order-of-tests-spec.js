const la = require('lazy-ass')
const is = require('check-more-types')
const _ = require('lodash')

/* global describe, it */
describe('order of tests', function () {
  const set = require('./order-of-tests').set
  function toTest (name) {
    return { title: name }
  }
  function toTests () {
    return _.toArray(arguments).map(toTest)
  }

  it('is a function', () => {
    la(is.fn(set))
  })

  it('works for missing suite', () => {
    const suite = {
      fullTitle: () => 'foo',
      suites: [],
      tests: ['foo', 'bar']
    }
    const order = []
    set(suite, order)
    la(_.isEqual(suite.tests, ['foo', 'bar']))
  })

  it('changes order to specified', () => {
    const suite = {
      fullTitle: () => 's1',
      suites: [],
      tests: toTests('foo', 'bar')
    }
    const order = [{
      title: 's1',
      tests: ['bar', 'foo']
    }]
    set(suite, order)
    la(_.isEqual(suite.tests, toTests('bar', 'foo')),
      'did not change order', suite.tests)
  })

  it('ignores titles that are not found', () => {
    const suite = {
      fullTitle: () => 's1',
      suites: [],
      tests: toTests('foo', 'bar')
    }
    const order = [{
      title: 's1',
      tests: ['bar', 'foo', 'baz']
    }]
    set(suite, order)
    la(_.isEqual(suite.tests, toTests('bar', 'foo')),
      'kept tests not in order', suite.tests)
  })

  it('adds new tests at the end of the list', () => {
    const suite = {
      fullTitle: () => 's1',
      suites: [],
      tests: toTests('foo', 'bar')
    }
    const order = [{
      title: 's1',
      tests: ['bar']
    }]
    set(suite, order)
    la(_.isEqual(suite.tests, toTests('bar', 'foo')),
      'added foo at the end', suite.tests)
  })
})
