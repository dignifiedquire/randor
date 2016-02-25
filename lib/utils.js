'use strict'

const bl = require('bl')
const randomString = require('random-string')
const Promise = require('bluebird')

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
      return new Buffer(randomString())
    default:
      throw new Error('Unkown Type: ' + arg)
  }
}

exports.randomInclusive = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
