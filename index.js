'use strict'

require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'lib/**/*.js'
})
const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')

const exec = require('./lib/exec')
const generate = require('./lib/generate')
const OPERATIONS = requireDir('./lib/operations', {camelCase: true})

const daemon = () => new Promise((resolve, reject) => {
  ipfsd.disposable((err, node) => {
    if (err) return reject(err)
    node.startDaemon((err, ipfs) => {
      if (err) return reject(err)
      resolve(ipfs)
    })
  })
})
daemon()
  .then((ipfs) => {
    return exec(OPERATIONS, ipfs, generate(OPERATIONS, 10))
  })
  .then(() => {
    console.log('SUCCESS')
    process.exit()
  })
  .catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
