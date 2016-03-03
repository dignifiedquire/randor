'use strict'

const _ = require('lodash')
const assert = require('power-assert')
const Promise = require('bluebird')

const TYPES = require('../types')
const utils = require('../utils')

module.exports = {
  cmd: 'add',
  args: [TYPES.TREE, {recursive: true}],
  parallel: true,
  validator (ipfs, args, out) {
    const files = args[0]
    const added = out[0]
    console.log('ADD')
    console.log(out)
    console.log('\n\n')

    const addedNames = _.map(added, 'Name')
    files.forEach((file) => {
      assert(_.includes(addedNames, file.path))
    })

    return Promise.map(added, (file) => Promise.join(
      ipfs.cat(file.Hash),
      ipfs.pin.list({hash: file.Hash}),
      (stream, pins) => {
        assert(_.includes(Object.keys(pins.Keys), file.Hash))
        return utils.eqlHashStreamBuffer(
          stream,
          _.find(files, {path: file.Name}).content
        )
      }
    ))
  }
}
