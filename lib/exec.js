'use strict'

const Promise = require('bluebird')
const _ = require('lodash')
const Gauge = require('gauge')

const log = require('debug')('randor:exec')

module.exports = function exec (ipfs, ops) {
  const gauge = new Gauge()
  const total = ops.length

  gauge.show('exec', 0.001)

  return Promise.mapSeries(ops, (op, i) => {
    const args = op.args
    log('start', op.cmd)
    gauge.show(`exec:${op.cmd}`, i / total)

    const setup = op.setup || (() => Promise.resolve(args))

    return setup(ipfs, args)
      .then((processedArgs) => {
        const cmd = op.cmd
                .replace(/\s/g, '.')
                .replace(/-([a-z])/g, (g) => g[1].toUpperCase())

        log('calling %s', cmd)
        return _.get(ipfs, cmd).apply(ipfs, processedArgs)
          .then(function () {
            log('validating %s', op.cmd)
            return op.validator.apply(null, [ipfs, processedArgs, arguments])
          })
      })
  })
}
