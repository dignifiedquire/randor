'use strict'

const log = require('debug')('randor:exec')
const Promise = require('bluebird')

const utils = require('./utils')

module.exports = function exec (operations, ipfs, ops) {
  log('Executing', ops)

  return Promise.mapSeries(
    ops.map((type) => operations[type]),
    (op) => {
      const args = op.args.map(utils.instantiateArgs)
      log('Executing %s', op.cmd, args)

      return ipfs[op.cmd].apply(ipfs, args)
        .then(function () {
          return op.validator.apply(null, [ipfs, args, arguments])
        })
    }
  )
}
