'use strict'

const bl = require('bl')
const Promise = require('bluebird')
const qc = require('quick_check')
const assert = require('power-assert')
const crypto = require('crypto')

const TYPES = require('./types')

exports.collect = (stream) => {
  return new Promise((resolve, reject) => {
    stream.pipe(bl((err, data) => {
      if (err) return reject(err)
      resolve(data)
    }))
  })
}

exports.instantiateArgs = (arg) => {
  switch (arg) {
    case TYPES.TEXT:
      return new Buffer(qc.string.ascii(1000))
    default:
      return arg
  }
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
