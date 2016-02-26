'use strict'

const qc = require('quick_check')
const _ = require('highland')

const utils = require('./utils')

module.exports = function generate (operations) {
  const genType = qc.pick.apply(qc, Object.keys(operations))

  const typeToOp = (type) => {
    const op = operations[type]
    op.args = op.args.map(utils.instantiateArgs)
    return op
  }

  // laziness ftw
  return _((push, next) => {
    push(null, typeToOp(genType()))
    next()
  })
}
