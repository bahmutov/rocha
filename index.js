const Mocha = require('mocha')
const mocha = new Mocha()
const _ = require('lodash')
const log = require('debug')('rocha')
const la = require('lazy-ass')
const check = require('check-more-types')
const chalk = require('chalk')
const exists = require('fs').existsSync

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
  la(check.array(tests), 'invalid tests', tests)
  la(check.array(titles), 'invalid titles', titles)
  la(tests.length === titles.length, 'different cardinality',
    tests, titles)
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

const join = require('path').join
const filename = join(process.cwd(), '.rocha.json')

function saveOrder (suite) {
  const order = collectTestOrder(suite)
  const json = JSON.stringify(order, null, 2)
  const save = require('fs').writeFileSync
  save(filename, json)
  log('saved order to file', filename)
}

function clearSavedOrder () {
  if (exists(filename)) {
    require('fs').unlinkSync(filename)
    log('tests have passed, deleted the current random order', filename)
  }
}

function loadOrder () {
  if (!exists(filename)) {
    return
  }
  const load = require('fs').readFileSync
  const json = load(filename)
  const order = JSON.parse(json)
  log('loaded order from', filename)
  return order
}

function rocha (options) {
  options = options || {}

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
    const order = loadOrder()
    if (order) {
      // how to make sure we ran with
      // the same set of test files?
      log('reordering specs like last time')
      setOrder(mocha.suite, order)
    } else {
      shuffleTests(mocha.suite)
      saveOrder(mocha.suite)
    }
  })

  mocha.run(function (failures) {
    process.on('exit', function () {
      if (failures === 0) {
        clearSavedOrder()
      } else {
        console.error('Failed tests order saved in', chalk.yellow(filename))
        console.error('If you run Rocha again, the same failed test order will be used')
      }
      process.exit(failures)
    })
  })
}

module.exports = rocha
