'use strict'

const assert = require('power-assert')

const TYPES = require('../types')
const collect = require('../utils').collect

module.exports = {
  cmd: 'add',
  args: [TYPES.TEXT],
  validator (ipfs, args, out) {
    return ipfs.cat(out[0][0].Hash)
      .then(collect)
      .then((data) => {
        assert.equal(data, args[0].toString())
      })
  }
}
