'use strict'

const qc = require('quick_check')

const TYPES = require('./types')

module.exports = (arg) => {
  switch (arg) {
    case TYPES.TEXT_BUFFER:
      return new Buffer(qc.string(5 * 1024 * 1024))
    case TYPES.NAME:
      return qc.string.matching(/^myname/)(10)
    case TYPES.DATA:
      return qc.string.matching(/^hello/)(128 * 1024)
    case TYPES.OBJECT_BUFFER:
      return new Buffer(JSON.stringify({Data: qc.string.matching(/^hello/)(128 * 1024)}))
    case TYPES.BOOL:
      return qc.bool()
    case TYPES.PATH:
      return '/a' + qc.string.ascii(10)
    default:
      return arg
  }
}
