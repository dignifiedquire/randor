'use strict'

const assert = require('power-assert')
const _ = require('lodash')

const TYPES = require('../types')

module.exports = {
  cmd: 'pin remove',
  args: [TYPES.DATA, TYPES.BOOL],
  setup (ipfs, args) {
    const data = args[0]
    const isFile = args[1]

    if (isFile) {
      return ipfs.add(new Buffer(data))
        .then((res) => [res[0].Hash])
    } else {
      const obj = new Buffer(JSON.stringify({Data: data}))
      return ipfs.object.put(obj)
        .then((res) => {
          return ipfs.pin.add(res.Hash).then(() => [res.Hash])
        })
    }
  },
  validator (ipfs, args, out) {
    return ipfs.pin.list('all')
      .then((pins) => {
        assert(!_.includes(Object.keys(pins.Keys), out[0]))
      })
  }
}
