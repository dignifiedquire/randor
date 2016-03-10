'use strict'

const assert = require('power-assert')
const Promise = require('bluebird')
const _ = require('lodash')

const TYPES = require('../types')
const utils = require('../utils')

// files write
// ===========
//
// This tests the `ipfs files write` command.
//
// The execution consists of
//
// 1. Running `ipfs files mkdir <dir>` for all needed directories
// 2. Running `ipfs files write <path> <content>` for all the files
//
// The Validation consists of
//
// 1. For all files
//   * Running `ipfs files read <path>`
//   * Assert the result is equal to the content added

function filesToDirs (files) {
  return _(files)
    .map('path')
    .sort()
    .flatMap((file) => {
      // '/my/file/path.exe'
      return _(file.split('/'))
      // ['', 'my', 'file', 'path.exe']
        .compact()
      // ['my', 'file', 'path.exe']
        .dropRight()
      // ['my', 'file']
        .reduce((acc, val) => {
          acc.push((_.last(acc) || '') + '/' + val)
          return acc
        }, [])
      // ['/my', '/my/file']
    })
    .uniq()
    .value()
}

module.exports = {
  cmd: 'files write',
  args: [TYPES.TREE_NESTED_1],
  parallel: true,
  exec (ipfs, tree) {
    const files = tree[0]
    const dirs = filesToDirs(files)

    return Promise
      .mapSeries(dirs, (dir) => ipfs.files.mkdir(dir))
      .then(() => Promise.map(files, (file) => {
        return ipfs.files.write(file.path, new Buffer(file.content), {create: true})
      }))
      .then(() => files)
  },
  validator (ipfs, args, out) {
    const files = args[0]

    return Promise
      .map(files, (file) => ipfs.files.read(file.path))
      .map(utils.collect)
      .map((res, i) => {
        assert(res.toString() === files[i].content)
      })
  }
}
