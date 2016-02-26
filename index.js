'use strict'

require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'lib/**/*.js'
})
const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')
const _ = require('highland')
const debug = require('debug')

const exec = require('./lib/exec')
const generate = require('./lib/generate')
const OPERATIONS = requireDir('./lib/operations', {camelCase: true})

const log = debug('randor:main')
log.error = debug('randor:error')

const commandCount = 1000

_
  .wrapCallback(ipfsd.disposable)()
  .flatMap((node) => {
    log('Starting daemon')
    return _.wrapCallback(node.startDaemon.bind(node))()
  })
  .flatMap((ipfs) => {
    log('Starting operations')
    return generate(OPERATIONS).flatMap(exec(ipfs))
  })
  .take(commandCount)
  .errors((err) => {
    if (err) {
      log.error(err)
      process.exit(1)
    }
  })
  .done(() => {
    process.exit()
  })
