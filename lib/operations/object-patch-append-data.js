'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')

const TYPES = require('../types')

// object patch append-data
// ========================
//
// This tests the `ipfs object patch append-data` command.
//
// The setup consists of
//
// 1. Running `ipfs object put --json <data>` where `<data>` is of the form
//    ```json
//    {
//      "Data": "Some random string"
//    }
//    ```
//
// The Validation consists of
//
// 1. Running `ipfs object get <hash>` of the return value of the `append-data` cmd
// 2. Assert that the returned `Data` value is equal to the original `Data` value
//    concated with the appended value.

module.exports = {
  cmd: 'object patch append-data',
  args: [TYPES.OBJECT_BUFFER, TYPES.TEXT_BUFFER],
  parallel: true,
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
