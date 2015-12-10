#!/usr/bin/env node --harmony

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

const spec = process.argv[2]
const rocha = require('..')
rocha({ spec: spec })
