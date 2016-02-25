'use strict'

const qc = require('quick_check')
const log = require('debug')('randor:generate')

module.exports = function generate (operations, length) {
  log('Generating %s ops', length)

  const keys = qc.pick.apply(qc, Object.keys(operations))

  return qc.arrayOf(keys, {
    length: length
  })()
}
