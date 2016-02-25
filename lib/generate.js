'use strict'

const log = require('debug')('randor:generate')

const utils = require('./utils')

module.exports = function generate (operations, length) {
  log('Generating %s ops', length)

  return (new Array(length).fill(0)).map(() => {
    const keys = Object.keys(operations)
    const index = utils.randomInclusive(0, keys.length - 1)
    return keys[index]
  })
}
