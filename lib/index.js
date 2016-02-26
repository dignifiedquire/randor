'use strict'

const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')
const _ = require('highland')
const debug = require('debug')
const getSize = require('get-folder-size')

const exec = require('./exec')
const generate = require('./generate')
const OPERATIONS = requireDir('./operations', {camelCase: true})

const log = debug('randor:main')
log.error = debug('randor:error')
log.stats = debug('randor:stats')

module.exports = (limit, logSize) => {
  let ipfsPath

  return _
    .wrapCallback(ipfsd.disposable)()
    .flatMap((node) => {
      log('Starting daemon')
      ipfsPath = node.path
      return _.wrapCallback(node.startDaemon.bind(node))()
    })
    .flatMap((ipfs) => {
      log('Starting operations')
      const ops = generate(OPERATIONS).flatMap(exec(ipfs))

      if (logSize) {
        ops
          .observe()
          .throttle(1000)
          .flatMap(() => _.wrapCallback(getSize)(ipfsPath))
          .each((size) => {
            console.log(`Repo size: ${(size / 1024 / 1024).toFixed(2)} Mb\n`)
          })
      }

      return ops
    })
    .take(limit)
}
