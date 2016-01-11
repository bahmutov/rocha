#!/usr/bin/env node

'use strict'

const help = [
  'USE: rocha <spec file pattern>',
  '     rocha *-spec.js',
  '     rocha spec/my-test-file.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 3,
  packagePath: __dirname + '/../package.json',
  help: help
})

// console.log(process.argv)

const spec = process.argv.slice(2)
const rocha = require('..')
rocha({ spec: spec })
