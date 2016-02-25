'use strict'

const assert = require('power-assert')

module.exports = {
  cmd: 'version',
  args: [],
  validator (ipfs, args, out) {
    return new Promise((resolve, reject) => {
      assert(out[0].Version === '0.4.0-dev')
      resolve()
    })
  }
}
