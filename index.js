'use strict'

const ipfs = require('ipfs-api')()
const requireDir = require('require-dir')

const exec = require('./lib/exec')
const generate = require('./lib/generate')
const OPERATIONS = requireDir('./lib/operations', {camelCase: true})

exec(OPERATIONS, ipfs, generate(OPERATIONS, 10))
  .then(() => {
    console.log('SUCCESS')
    process.exit()
  })
  .catch((err) => {
    console.error('FAILURE')
    console.error(err)
    process.exit(1)
  })
