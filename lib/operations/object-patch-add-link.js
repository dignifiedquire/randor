'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')
const qc = require('quick_check')

const TYPES = require('../types')

const log = require('debug')('randor:ops:object-patch-append-data')

module.exports = {
  cmd: 'object patch add-link',
  args: [TYPES.NAME],
  setup (ipfs, args) {
    const data1 = new Buffer(JSON.stringify({Data: qc.string.matching(/^hello/)(100)}))
    const data2 = new Buffer(JSON.stringify({Data: qc.string.matching(/^hello/)(100)}))

    return Promise.join(
      ipfs.object.put(data1, 'json'),
      ipfs.object.put(data2, 'json'),
      (res1, res2) => [res1.Hash, args[0], res2.Hash]
    )
  },
  validator (ipfs, args, out) {
    log('validating')
    const linked = out[0].Hash

    return ipfs.object.get(linked)
      .then((res) => {
        assert(res.Links[0].Name === args[1])
        assert(res.Links[0].Hash === args[2])
      })
  }
}
