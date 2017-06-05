const Mocha = require('mocha')
const mocha = new Mocha()
const log = require('debug')('rocha')
const la = require('lazy-ass')
const is = require('check-more-types')
const chalk = require('chalk')

const order = require('./src/order-of-tests')
const cache = require('./src/order-cache')
la(is.object(cache), 'missing test order object')

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
    const cachedOrder = cache.load()
    if (cachedOrder) {
      log('reordering specs like last time')
      order.set(mocha.suite, cachedOrder)
    } else {
      const randomOrder = order.shuffle(mocha.suite)
      console.log('shuffled order\n%j', randomOrder)
    }

    // the order might be out of date if any tests
    // were added or deleted, thus
    // always collect the order
    const testNames = order.collect(mocha.suite)
    cache.save(testNames)
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
