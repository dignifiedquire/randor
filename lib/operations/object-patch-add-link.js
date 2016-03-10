'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')

const TYPES = require('../types')

// object patch add-link
// =====================
//
// This tests the `ipfs object patch add-link` command.
//
// The setup consists of
//
// 1. Running `ipfs object put --json <data>` twice where `<data>` is of the form
//    ```json
//    {
//      "Data": "Some random string"
//    }
//    ```
//    with two different `<data>` values.
//
// The Validation consists of
//
// 1. Running `ipfs object get <hash>` of the return value of the `append-link` cmd
// 2. Assert that the returned `Links` value is equal to
//    ```json
//    "Links": [{"Name": "<name>", "Hash": "<hash>"}]
//    ```

module.exports = {
  cmd: 'object patch add-link',
  args: [TYPES.OBJECT_BUFFER, TYPES.NAME, TYPES.OBJECT_BUFFER],
  parallel: true,
  setup (ipfs, args) {
    return Promise.join(
      ipfs.object.put(args[0], 'json'),
      ipfs.object.put(args[2], 'json'),
      (res1, res2) => [res1.Hash, args[1], res2.Hash]
    )
  },
  validator (ipfs, args, out) {
    const linked = out[0].Hash

    return ipfs.object.get(linked)
      .then((res) => {
        assert(res.Links[0].Name === args[1])
        assert(res.Links[0].Hash === args[2])
      })
  }
}
