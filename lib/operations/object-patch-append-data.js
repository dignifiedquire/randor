'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')

const TYPES = require('../types')

module.exports = {
  cmd: 'object patch append-data',
  args: [TYPES.OBJECT_BUFFER, TYPES.TEXT_BUFFER],
  setup (ipfs, args) {
    return ipfs.object.put(args[0], 'json')
      .then((res) => {
        return [res.Hash, args[1]]
      })
  },
  validator (ipfs, args, out) {
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
