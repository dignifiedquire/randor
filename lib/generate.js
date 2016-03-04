'use strict'

const Chance = require('chance')
const _ = require('highland')
const log = require('debug')('randor:generate')
const intersection = require('lodash').intersection

const args = require('./args')

exports.generate = (operations, parallelLevel, seed, limitOps) => {
  const parallel = parallelLevel > 1
  const chance = new Chance(seed)
  log('Parallel level %s', parallelLevel)
  log('Seed %s', seed)
  let keys = Object.keys(operations)
  if (limitOps && limitOps.length > 0) {
    keys = intersection(Object.keys(operations), limitOps)
  }
  const filteredKeys = keys.filter((key) => {
    if (parallel) return operations[key].parallel
    return true
  })

  log('Pool of operations:', filteredKeys)
  // laziness ftw
  return _((push, next) => {
    log('Generating operation')
    push(null, chance.pickone(filteredKeys))
    next()
  })
}

exports.instantiate = (operations, seed, type, cb) => {
  log('Instantiate for %s', type)
  return _([operations[type]])
    .flatMap((op) => _(op.args))
    .tap((arg) => log('arg', arg))
    .flatMap((a) => args(seed, a))
    .collect()
    .map((res) => {
      log('Args for %s', type, res)
      return Object.assign({}, operations[type], {
        args: res
      })
    })
}
