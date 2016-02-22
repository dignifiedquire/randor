'use strict'

const ipfs = require('ipfs-api')()
const assert = require('power-assert')
const bl = require('bl')
const randomString = require('random-string')
const debug = require('debug')

const log = debug('randor')

const TYPES = {
  TEXT: 'text'
}

const collect = (stream) => {
  return new Promise((resolve, reject) => {
    stream.pipe(bl((err, data) => {
      if (err) return reject(err)
      resolve(data)
    }))
  })
}

const OPERATIONS = {
  ADD: {
    cmd: 'add',
    args: [TYPES.TEXT],
    validator (args, out) {
      log('validating add')
      return ipfs.cat(out[0][0].Hash)
        .then(collect)
        .then((data) => {
          assert.equal(data, args[0].toString())
        })
    }
  },
  version: {
    cmd: 'version',
    args: [],
    validator (args, out) {
      return new Promise((resolve, reject) => {
        assert(out[0].Version === '0.4.0-dev')
        resolve()
      })
    }
  }
}

const instantiateArgs = (arg) => {
  switch (arg) {
  case TYPES.TEXT:
    return new Buffer(randomString())
  default:
    throw new Error('Unkown Type: ' + arg)
  }
}

const exec = (ops) => {
  log('Executing', ops)
  return Promise.all(
    ops
      .map((type) => OPERATIONS[type])
      .map((op) => {
        const args = op.args.map(instantiateArgs)
        log('Executing %s', op.cmd, args)
        return ipfs[op.cmd].apply(ipfs, args)
          .then(function () {
            return op.validator.apply(null, [args, arguments])
          })
      })
  )
}
const randomInclusive = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generate = (length) => {
  log('Generating %s ops', length)
  return (new Array(length).fill(0)).map(() => {
    const keys = Object.keys(OPERATIONS)
    const index = randomInclusive(0, keys.length - 1)
    return keys[index]
  })
}

exec(generate(10))
  .then(() => {
    console.log('SUCCESS')
    process.exit()
  })
  .catch((err) => {
    console.error('FAILURE')
    console.error(err)
    process.exit(1)
  })
