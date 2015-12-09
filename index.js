var Mocha = require('mocha')
var mocha = new Mocha()
var shuffle = require('lodash.shuffle')

mocha.addFile('./spec.js');

function shuffleTests(suite) {
  console.log('shuffling %d unit tests in "%s"',
    suite.tests.length, suite.title);
  suite.tests = shuffle(suite.tests);
  suite.suites.forEach(shuffleTests);
}

mocha.suite.beforeAll(function () {
  console.log('before all suite event')
  console.log('total %d tests', mocha.suite.total())
  console.log('first suite title "%s"', mocha.suite.fullTitle());

  shuffleTests(mocha.suite);

  console.log('has inside', mocha.suite.suites.map(function (s) {
    return s.fullTitle()
  }))
})

mocha.run(function (failures) {
  console.log('mocha run finished with %d failures', failures)

  process.on('exit', function () {
    process.exit(failures)
  })
})
