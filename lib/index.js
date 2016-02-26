'use strict'

const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')
const _ = require('highland')
const debug = require('debug')

const exec = require('./exec')
const generate = require('./generate')
const OPERATIONS = requireDir('./operations', {camelCase: true})

const log = debug('randor:main')
log.error = debug('randor:error')

module.exports = (limit) => _
  .wrapCallback(ipfsd.disposable)()
  .flatMap((node) => {
    log('Starting daemon')
    return _.wrapCallback(node.startDaemon.bind(node))()
  })
  .flatMap((ipfs) => {
    log('Starting operations')
    return generate(OPERATIONS).flatMap(exec(ipfs))
  })
  .take(limit)
