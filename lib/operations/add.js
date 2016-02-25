'use strict'

const _ = require('lodash')
const assert = require('power-assert')
const Promise = require('bluebird')

const TYPES = require('../types')
const utils = require('../utils')

module.exports = {
  cmd: 'add',
  args: [TYPES.TEXT_BUFFER],
  validator (ipfs, args, out) {
    const hash = out[0][0].Hash
    return Promise.join(
      ipfs.cat(hash),
      ipfs.pin.list('recursive'),
      (stream, pins) => {
        assert(_.includes(Object.keys(pins.Keys), hash))
        return utils.eqlHashStreamBuffer(stream, args[0])
      }
    )
  }
}
