const Mocha = require('mocha')
const mocha = new Mocha()
const shuffle = require('lodash.shuffle')

function shuffleTests (suite) {
  if (suite.tests.length) {
    console.log('shuffling %d unit tests in "%s"',
      suite.tests.length, suite.title)
    suite.tests = shuffle(suite.tests)
  }
  suite.suites.forEach(shuffleTests)
}

function rocha (options) {
  options = options || {}

  var specFilename = options.spec
  if (!specFilename) {
    console.error('Missing spec file pattern')
    process.exit(-1)
  }

  mocha.addFile(specFilename)

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
