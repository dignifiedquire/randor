'use strict'

const qc = require('quick_check')
const _ = require('highland')

const args = require('./args')

module.exports = function generate (operations, parallelLevel) {
  const parallel = parallelLevel > 1

  const keys = Object.keys(operations).filter((key) => {
    if (parallel) return operations[key].parallel
    return true
  })
  const genType = qc.pick.apply(qc, keys)

  const typeToOp = (type) => {
    const op = operations[type]
    op.args = op.args.map(args)
    return op
  }

  // laziness ftw
  return _((push, next) => {
    push(null, typeToOp(genType()))
    next()
  })
}
