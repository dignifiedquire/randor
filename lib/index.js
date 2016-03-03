'use strict'

const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')
const _ = require('highland')
const getSize = require('get-folder-size')
const fs = require('fs')
const ndjson = require('ndjson')

const exec = require('./exec')
const utils = require('./utils')
const gen = require('./generate')
const generate = gen.generate
const instantiate = gen.instantiate
const OPERATIONS = requireDir('./operations', {camelCase: true})

const log = require('debug')('randor:main')

module.exports = (limit, logSize, parallelLevel, write, read) => {
  let seed = Math.random()
  let ipfsPath
  let store
  let serialize
  let options

  if (read) {
    const rawStore = utils.split(
      _(fs.createReadStream('store.json').pipe(ndjson.parse()))
    )

    options = rawStore[0]
    store = rawStore[1]

    limit = null
    write = false
  } else {
    options = _([{
      seed: seed,
      parallelLevel: parallelLevel
    }])
  }

  if (write) {
    store = fs.createWriteStream('store.json')
    serialize = ndjson.serialize()
    serialize.write({
      seed: seed,
      parallelLevel: parallelLevel
    })
  }

  return _
    .wrapCallback(ipfsd.disposable)()
    .flatMap((node) => {
      log('Starting daemon')
      ipfsPath = node.path
      return _.wrapCallback(node.startDaemon.bind(node))()
    })
    .zip(options)
    .flatMap((args) => {
      log('Starting operations')
      const ipfs = args[0]
      const opts = args[1]
      let ops
      if (read) {
        ops = store.map((obj) => obj.type)
      } else {
        ops = generate(OPERATIONS, opts.parallelLevel, opts.seed)
      }
      const execs = ops
              .fork()
              .flatMap((type) => instantiate(OPERATIONS, opts.seed, type))
              .map(exec(ipfs))
              .parallel(parallelLevel)

      if (write) {
        ops
          .observe()
          .map((type) => ({type: type}))
          .pipe(serialize)
          .pipe(store)
      }

      if (logSize) {
        ops
          .observe()
          .throttle(1000)
          .flatMap(() => _.wrapCallback(getSize)(ipfsPath))
          .each((size) => {
            console.log(`Repo size: ${(size / 1024 / 1024).toFixed(2)} Mb\n`)
          })
      }

      return execs
    })
    .take(limit)
}
