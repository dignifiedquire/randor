'use strict'

const assert = require('power-assert')

const TYPES = require('../types')
const utils = require('../utils')

module.exports = {
  cmd: 'files write',
  args: [TYPES.PATH, TYPES.TEXT_BUFFER, {create: true}],
  validator (ipfs, args, out) {
    const file = args[0]

    return ipfs.files.read(file)
      .then(utils.collect)
      .then((res) => {
        assert(res.toString() === args[1].toString())
      })
  }
}
