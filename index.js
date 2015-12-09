var Mocha = require('mocha')
var mocha = new Mocha()

mocha.addFile('./spec.js');

mocha.suite.beforeAll(function () {
  console.log('before all suite event')
  console.log('total %d tests', mocha.suite.total())
  console.log('first suite title "%s"', mocha.suite.fullTitle());
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
