const la = require('lazy-ass')
const is = require('check-more-types')
const _ = require('lodash')
const {set, shuffle} = require('./order-of-tests')
const snapshot = require('snap-shot')
const R = require('ramda')

/* global describe, it */
describe('shuffle', () => {
  it('is a function', () => {
    la(is.fn(shuffle), shuffle)
  })

  it('does not shuffle undefined', () => {
    la(_.isUndefined(shuffle()))
  })

  it('does not shuffle empty', () => {
    la(snapshot(shuffle({})))
  })

  it('does not shuffle empty suites', () => {
    const s = {
      suites: []
    }
    la(snapshot(shuffle(s)))
  })

  it('returns different object', () => {
    const s = {
      suites: [1, 2, 3]
    }
    const shuffled = shuffle(s)
    la(shuffled !== s, 'returns new object')
  })

  it('returns shuffled suites', () => {
    const s = {
      suites: R.range(1, 100)
    }
    const shuffled = shuffle(s)
    la(!_.isEqual(shuffled.suites, s.suites),
      'shuffled suites are the same',
      shuffled.suites, 'initial', s.suites)
  })

  it('shuffles top level names', () => {
    const s1 = {
      name: 's1',
      suites: R.range(1, 10)
    }
    const s2 = {
      name: 's2',
      suites: R.range(20, 30)
    }
    const s3 = {
      name: 's3',
      suites: R.range(40, 50)
    }
    const s = {
      suites: [s1, s2, s3]
    }
    const names = ['s1', 's2', 's3']
    const shuffled = shuffle(s)
    const shuffledNsames = R.pickAll('name')(shuffled)
    la(!_.isEqual(names, shuffledNsames),
      'suites should be shuffled', shuffledNsames)
  })

  it('shuffles nested suites', () => {
    const s1 = {
      name: 's1',
      suites: R.range(1, 10)
    }
    const s2 = {
      name: 's2',
      suites: R.range(20, 30)
    }
    const s3 = {
      name: 's3',
      suites: R.range(40, 50)
    }
    const s = {
      suites: [s1, s2, s3]
    }
    const shuffled = shuffle(s)
    const shuffledS1 = R.find(R.propEq('name', 's1'))(shuffled.suites)
    la(!_.isEqual(shuffledS1.suites, s1.suites),
      'did not shuffle s1', shuffledS1.suites)
  })
})

describe('order of tests', function () {
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
