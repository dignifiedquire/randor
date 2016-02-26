'use strict'

const Promise = require('bluebird')
const get = require('lodash').get
const _ = require('highland')

const log = require('debug')('randor:exec')

function toApiCmd (cmd) {
  return cmd
    .replace(/\s/g, '.')
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

module.exports = (ipfs) => (op) => {
  const args = op.args
  log('start', op.cmd)

  const setup = op.setup || (() => Promise.resolve(args))

  return _(setup(ipfs, args)
    .then((processedArgs) => {
      const cmd = toApiCmd(op.cmd)

      log('calling %s', cmd)

      return get(ipfs, cmd).apply(ipfs, processedArgs)
        .then(function () {
          log('validating %s', op.cmd)
          return op.validator.apply(null, [ipfs, processedArgs, arguments])
        })
    }))
}
