const log = require('debug')('rocha')
const la = require('lazy-ass')
const is = require('check-more-types')
const _ = require('lodash')

function shuffleTests (suite) {
  if (suite.tests.length) {
    log('shuffling %d unit tests in "%s"',
      suite.tests.length, suite.title)
    suite.tests = _.shuffle(suite.tests)
  }
  suite.suites.forEach(shuffleTests)
}

function collectSuite (suite, collected) {
  collected.push({
    title: suite.fullTitle(),
    tests: suite.tests.map(t => t.title)
  })
  suite.suites.forEach(s => collectSuite(s, collected))
}

function collectTestOrder (rootSuite) {
  const suites = []
  collectSuite(rootSuite, suites)
  return suites
}

function setTestOrder (suite, tests, titles) {
  la(is.array(tests), 'invalid tests', tests)
  la(is.array(titles), 'invalid titles', titles)
  la(tests.length === titles.length, 'different cardinality', tests, titles)

  const orderedTests = []
  titles.forEach(title => {
    const test = _.find(tests, { title: title })
    la(test, 'could not find test with title', title,
      'among', tests, 'in', suite.fullTitle())
    orderedTests.push(test)
  })
  suite.tests = orderedTests
}

function setOrder (suite, order) {
  const foundInfo = _.find(order, { title: suite.fullTitle() })
  if (foundInfo) {
    log('restoring order to', foundInfo.title)
    // need to compare number of tests, etc
    setTestOrder(suite, suite.tests, foundInfo.tests)
  }
  suite.suites.forEach(s => setOrder(s, order))
}

module.exports = {
  shuffle: shuffleTests,
  set: setOrder,
  collect: collectTestOrder
}
