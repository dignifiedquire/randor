'use strict'

const _ = require('lodash')
const assert = require('power-assert')
const Promise = require('bluebird')
const log = require('debug')('randor:operations:add')

const TYPES = require('../types')
const utils = require('../utils')

// ipfs add
// ========
//
// This tests the `ipfs add` command recursively with multiple folders
// and files.
//
// The Validation consists of
//
// 1. Assert the returned list of added files from ipfs contains
//    all added files
// 2. For each added file do
//    * `ipfs cat <hash>` -> assert sha1(content) is equal to sha1(returnValue)
//    * `ipfs pin list <hash>` -> assert <hash> is returned
//

module.exports = {
  cmd: 'add',
  args: [TYPES.TREE, {recursive: true}],
  parallel: true,
  validator (ipfs, args, out) {
    const files = args[0]
    const added = out[0]

    const addedNames = _.map(added, 'Name')
    log('added', addedNames)
    files.forEach((file) => {
      assert(_.includes(addedNames, file.path))
    })

    const addedFiles = added.filter((file) => {
      return file.Name.match(/\..{3}$/)
    })

    return Promise.map(addedFiles, (file) => Promise.join(
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
