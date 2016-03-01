'use strict'

const Chance = require('chance')
const _ = require('highland')
const log = require('debug')('randor:generate')

const args = require('./args')

module.exports = function generate (operations, parallelLevel, seed) {
  const parallel = parallelLevel > 1
  const chance = new Chance(seed)
  log('Parallel level %s', parallelLevel)
  log('Seed %s', seed)

  const keys = Object.keys(operations).filter((key) => {
    if (parallel) return operations[key].parallel
    return true
  })

  const typeToOp = (type) => {
    const op = operations[type]
    op.args = op.args.map(args.bind(null, seed))
    log('Args for %s', type, op.args)
    return op
  }

  // laziness ftw
  return _((push, next) => {
    log('Generating operation')
    push(null, typeToOp(chance.pickone(keys)))
    next()
  })
}
