'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

const utils = require('./utils')

const log = require('debug')('randor:exec')

module.exports = function exec (operations, ipfs, ops) {
  log('operations', ops)

  return Promise.mapSeries(
    ops.map((type) => operations[type]),
    (op) => {
      const args = op.args.map(utils.instantiateArgs)
      log('start', op.cmd)

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
    }
  )
}
