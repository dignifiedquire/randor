'use strict'

const path = require('path')
const range = require('lodash').range
const defaults = require('lodash').defaults
const _ = require('highland')

// Modeled after https://github.com/jbenet/go-random-files

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function writeRandomFiles (root, depth, opts) {
  const numfiles = opts.fanoutFiles
  const numdirs = opts.fanoutDirs

  const files = _(range(0, numfiles))
          .map(() => writeRandomFile(root, opts))

  const dirs = _(range(0, numdirs))
          .flatMap(() => writeRandomDir(root, depth + 1, opts))

  if (depth + 1 <= opts.fanoutDepth) {
    return _.merge([files, dirs])
  }

  return files
}

function writeRandomFile (root, opts) {
  const chance = opts.chance

  const filesize = chance.natural({min: 1, max: 1024})
  const name = chance.string({pool: alphabet}) +
          '.' +
          chance.string({length: 3, pool: alphabet})
  const filepath = path.join(root, name)

  return {
    path: filepath,
    content: chance.string({length: filesize})
  }
}

function writeRandomDir (root, depth, opts) {
  if (depth > opts.fanoutDepth) return _.nil

  const chance = opts.chance

  const name = chance.string({pool: alphabet})
  const newRoot = path.join(root, name)

  return writeRandomFiles(newRoot, depth, opts)
}

module.exports = (chance, opts) => {
  opts = defaults(opts || {}, {
    // how deep the hierarchy goes
    fanoutDepth: 2,
    // how many files per dir
    fanoutFiles: 2,
    // how many dirs per dir
    fanoutDirs: 2,
    // top level folder
    root: '/',
    // instance of chance
    chance: chance
  })

  return writeRandomFiles(opts.root, 1, opts)
}
