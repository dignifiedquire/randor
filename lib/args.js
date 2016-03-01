'use strict'

const Chance = require('chance')
const requireDir = require('require-dir')

const TYPES = require('./types')
const mixins = requireDir('./chances')

module.exports = (seed, arg) => {
  const chance = new Chance(seed)
  Object.keys(mixins).forEach((key) => mixins[key](chance))

  switch (arg) {
    case TYPES.TEXT_BUFFER:
      return new Buffer(
        chance.string({length: 1024 * 1024})
      )
    case TYPES.NAME:
      return chance.word({length: 10})
    case TYPES.DATA:
      return chance.string({length: 128 * 1024})
    case TYPES.OBJECT_BUFFER:
      return new Buffer(
        JSON.stringify({
          Data: chance.string({length: 128 * 1024})
        })
      )
    case TYPES.BOOL:
      return chance.bool()
    case TYPES.PATH:
      return chance.path({base: '/', segments: 1, ext: '.txt'})
    default:
      return arg
  }
}
