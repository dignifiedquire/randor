'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')
const qc = require('quick_check')

const TYPES = require('../types')

const log = require('debug')('randor:ops:object-patch-append-data')

module.exports = {
  cmd: 'object patch append-data',
  args: [TYPES.TEXT],
  setup (ipfs, args) {
    const data = new Buffer(JSON.stringify({Data: qc.string.matching(/^hello/)(100)}))

    return ipfs.object.put(data, 'json')
      .then((res) => {
        return [res.Hash].concat(args)
      })
  },
  validator (ipfs, args, out) {
    log('validating')
    const original = args[0]
    const modified = out[0].Hash

    return Promise.map([
      original,
      modified
    ], (e) => ipfs.object.get(e))
      .then((res) => {
        assert(res[0].Data + args[1] === res[1].Data)
      })
  }
}
