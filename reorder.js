console.log(global)

// TODO how to get to the mocha instance that loads us?

var Mocha = require('mocha')
var mocha = new Mocha()

mocha.suite.beforeAll(function () {
  console.log('before all suite event')
  console.log('total %d tests', mocha.suite.total())
  console.log('first suite title "%s"', mocha.suite.fullTitle());
  console.log('has inside', mocha.suite.suites.map(function (s) {
    return s.fullTitle()
  }))
})
