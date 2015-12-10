const Mocha = require('mocha')
const mocha = new Mocha()
const shuffle = require('lodash.shuffle')
const log = require('debug')('rocha')

function shuffleTests (suite) {
  if (suite.tests.length) {
    log('shuffling %d unit tests in "%s"',
      suite.tests.length, suite.title)
    suite.tests = shuffle(suite.tests)
  }
  suite.suites.forEach(shuffleTests)
}

function testOrder (suite) {
  return [{
    title: suite.fullTitle(),
    tests: suite.tests.map(t => t.title),
    suites: suite.suites.map(testOrder)
  }]
}

const join = require('path').join
const filename = join(process.cwd(), '.rocha.json')

function saveOrder (suite) {
  const order = testOrder(suite)
  const json = JSON.stringify(order, null, 2)
  const save = require('fs').writeFileSync
  save(filename, json)
  log('saved order to file', filename)
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
    shuffleTests(mocha.suite)
    saveOrder(mocha.suite)
  })

  mocha.run(function (failures) {
    process.on('exit', function () {
      process.exit(failures)
    })
  })
}

module.exports = rocha
