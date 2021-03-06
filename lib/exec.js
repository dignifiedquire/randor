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
      log('calling %s', op.cmd)

      let cmd
      if (op.exec) {
        cmd = op.exec
      } else {
        cmd = (api, args) => get(api, toApiCmd(op.cmd)).apply(api, args)
      }

      return cmd(ipfs, processedArgs)
        .then(function () {
          log('validating %s', op.cmd)
          return op.validator.apply(null, [ipfs, processedArgs, arguments])
        })
        .then(() => {
          log('finished %s', op.cmd)
          return op.cmd
        })
    }))
}
