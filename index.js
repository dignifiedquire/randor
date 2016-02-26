'use strict'

require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'lib/**/*.js'
})

const ronin = require('ronin')

const program = ronin({
  path: __dirname,
  desc: 'Big Bad Tests for IPFS'
})

program.run()
