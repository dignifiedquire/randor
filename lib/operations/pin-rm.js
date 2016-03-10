'use strict'

const assert = require('power-assert')
const _ = require('lodash')
const log = require('debug')('randor:operations:pin-rm')

const TYPES = require('../types')

// pin rm
// ======
//
// This tests the `ipfs pin rm` command.
//
// The setup consists of
//
// * Randomly doing either
//   1. Creating a file
//     * `ipfs add <content>`
//   2. Creating an object
//     * `ipfs object put <content>`
//     * `ipfs pin add <hash>`
//
// The Validation consists of
//
// 1. Running `ipfs pin list --all`
// 2. Assert the hash from the setup is not listed in it

module.exports = {
  cmd: 'pin remove',
  args: [TYPES.DATA, TYPES.BOOL],
  parallel: true,
  setup (ipfs, args) {
    log('setup')
    const data = args[0]
    const isFile = args[1]

    if (isFile) {
      return ipfs.add(new Buffer(data))
        .then((res) => [res[0].Hash])
    } else {
      const obj = new Buffer(JSON.stringify({Data: data}))
      log(data.substring(0, 10))
      return ipfs.object.put(obj)
        .then((res) => {
          log('pinning %s', res.Hash, res)
          return ipfs.pin.add(res.Hash).then(() => [res.Hash])
        })
    }
  },
  validator (ipfs, args, out) {
    const pin = out[0].Pinned[0]
    log('Removed pin %s', pin)
    return ipfs.pin.list('all')
      .then((pins) => {
        log('Got pin list')
        assert(!_.includes(Object.keys(pins.Keys), pin))
      })
  }
}
