const Mocha = require('mocha')
const mocha = new Mocha()
const _ = require('lodash')
const log = require('debug')('rocha')
const la = require('lazy-ass')
const is = require('check-more-types')
const chalk = require('chalk')
const cache = require('./src/order-cache')
la(is.object(cache), 'missing test order object')

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

function rocha (options) {
  options = options || {}

  log('starting rocha with options')
  log(JSON.stringify(options, null, 2))

  var specFilenames = options.spec
  if (!specFilenames) {
    console.error('Missing spec file pattern')
    process.exit(-1)
  }

  if (typeof specFilenames === 'string') {
    specFilenames = [specFilenames]
  }

  specFilenames.forEach(mocha.addFile.bind(mocha))

  mocha.suite.beforeAll(function () {
    const order = cache.load()
    if (order) {
      // how to make sure we ran with
      // the same set of test files?
      log('reordering specs like last time')
      setOrder(mocha.suite, order)
    } else {
      shuffleTests(mocha.suite)
      const testNames = collectTestOrder(mocha.suite)
      cache.save(testNames)
    }
  })

  mocha.run(function (failures) {
    process.on('exit', function () {
      if (failures === 0) {
        cache.clear()
      } else {
        const filename = cache.filename()
        la(is.unemptyString(filename), 'missing save filename')
        console.error('Failed tests order saved in', chalk.yellow(filename))
        console.error('If you run Rocha again, the same failed test order will be used')
      }
      process.exit(failures)
    })
  })
}

module.exports = rocha
