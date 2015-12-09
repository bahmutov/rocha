var spec = process.argv[2]

var Mocha = require('mocha')
var mocha = new Mocha()
var shuffle = require('lodash.shuffle')

mocha.addFile(spec)

function shuffleTests (suite) {
  if (suite.tests.length) {
    console.log('shuffling %d unit tests in "%s"',
      suite.tests.length, suite.title)
    suite.tests = shuffle(suite.tests)
  }
  suite.suites.forEach(shuffleTests)
}

mocha.suite.beforeAll(function () {
  shuffleTests(mocha.suite)
})

mocha.run(function (failures) {
  process.on('exit', function () {
    process.exit(failures)
  })
})
