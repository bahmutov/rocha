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
  })

  mocha.run(function (failures) {
    process.on('exit', function () {
      process.exit(failures)
    })
  })
}

module.exports = rocha
