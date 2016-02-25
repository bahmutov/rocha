const log = require('debug')('rocha')
const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const filename = join(process.cwd(), '.rocha.json')
const exists = require('fs').existsSync
const rm = require('fs').unlinkSync
const read = require('fs').readFileSync

function saveOrder (ordered) {
  la(is.array(ordered), 'expected a list of suites', ordered)

  const json = JSON.stringify(ordered, null, 2)
  const save = require('fs').writeFileSync
  save(filename, json)
  log('saved order to file', filename)
  return filename
}

function clearSavedOrder () {
  if (exists(filename)) {
    rm(filename)
    log('tests have passed, deleted the current random order', filename)
  }
  return filename
}

function loadOrder () {
  if (!exists(filename)) {
    return
  }
  const json = read(filename)
  const order = JSON.parse(json)
  log('loaded order from', filename)
  return order
}

module.exports = {
  save: saveOrder,
  clear: clearSavedOrder,
  load: loadOrder,
  filename: function () {
    return filename
  }
}
