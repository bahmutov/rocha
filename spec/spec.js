// ./node_modules/mocha/bin/mocha spec.js
// console.log('mocha', mocha);

// mocha.events.on('suite', function () {
//   console.log('suite', arguments)
// })


describe('same tests', function () {

  console.log('inside same tests describe');

  // beforeAll(function () {
  //   console.log('before all')
  // })

  it('runs test 1', function () {
    console.log('test 1')
  })

  it('runs test 2', function () {
    console.log('test 2')
  })

  it('runs test 3', function () {
    console.log('test 3')
  })
})
