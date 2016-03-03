'use strict'

const bl = require('bl')
const Promise = require('bluebird')
const assert = require('power-assert')
const crypto = require('crypto')
const emojiLib = require('emojilib')
const _ = require('highland')

exports.collect = (stream) => {
  return new Promise((resolve, reject) => {
    stream.pipe(bl((err, data) => {
      if (err) return reject(err)
      resolve(data)
    }))
  })
}

exports.eqlHashStreamBuffer = (stream, buffer) => {
  const algorithm = 'sha1'

  return new Promise((resolve, reject) => {
    const streamHash = crypto.createHash(algorithm)
    const bufferHash = crypto.createHash(algorithm).update(buffer)

    streamHash.setEncoding('hex')
    bufferHash.setEncoding('hex')

    stream.pipe(streamHash).on('finish', () => {
      streamHash.end()
      bufferHash.end()

      assert(streamHash.read() === bufferHash.read())
      resolve()
    })
  })
}

exports.emoji = (name) => {
  return emojiLib.lib[name].char
}

// Thanks to @vqvu in https://github.com/caolan/highland/issues/459
exports.split = (stream) => {
  let yieldFn = null
  const head = _((push, next) => {
    stream.pull((err, x) => {
      push(err, x)
      push(null, _.nil)

      if (yieldFn) {
        yieldFn(stream)
      } else {
        yieldFn = true
      }
    })
  })

  const tail = _((push, next) => {
    if (yieldFn) {
      next(stream)
    } else {
      yieldFn = next
    }
  })

  return [head, tail]
}
