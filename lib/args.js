'use strict'

const Chance = require('chance')
const requireDir = require('require-dir')
const _ = require('highland')

const TYPES = require('./types')
const mixins = requireDir('./chances')
const tree = require('./generate-tree')

const generators = {
  [TYPES.TEXT_BUFFER] (chance) {
    return _([new Buffer(
      chance.string({length: 1024 * 1024})
    )])
  },

  [TYPES.NAME] (chance, cb) {
    return _([chance.word({length: 10})])
  },

  [TYPES.DATA] (chance, cb) {
    return _([chance.string({length: 128 * 1024})])
  },

  [TYPES.OBJECT_BUFFER] (chance, cb) {
    return _([new Buffer(
      JSON.stringify({
        Data: chance.string({length: 128 * 1024})
      })
    )])
  },

  [TYPES.BOOL] (chance, cb) {
    return _([chance.bool()])
  },

  [TYPES.PATH] (chance, cb) {
    return _([chance.path({
      base: '/',
      segments: 1,
      ext: '.txt'
    })])
  },

  [TYPES.TREE] (chance, cb) {
    return tree(chance, {}).collect()
  }
}

module.exports = (seed, arg) => {
  const chance = new Chance(seed)
  Object.keys(mixins).forEach((key) => mixins[key](chance))

  if (generators[arg]) {
    return generators[arg](chance)
  }

  return _([arg])
}
