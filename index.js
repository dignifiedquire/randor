'use strict'

require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'lib/**/*.js'
})
const Promise = require('bluebird')
const ipfsd = require('ipfsd-ctl')
const requireDir = require('require-dir')
const fs = Promise.promisifyAll(require('fs'))

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

let commandCount
let commandList

if (process.argv.length > 2) {
  const filename = process.argv[2]
  commandCount = parseInt(filename.split('-')[0], 10)
  commandList = JSON.parse(fs.readFileSync(filename, 'utf8'))
} else {
  commandCount = 100 // * 1000
  commandList = generate(OPERATIONS, commandCount)
}

daemon()
  .then((ipfs) => exec(ipfs, commandList))
  .then(() => {
    console.log('SUCCESS')
    process.exit()
  })
  .catch((err) => {
    console.log('FAILURE')
    console.error(err.message)
    console.error(err.stack)

    const fileName = `${commandCount}-${+new Date()}.json`

    return fs.writeFileAsync(fileName, JSON.stringify(commandList))
      .then(() => {
        console.log('Wrote commands %s', fileName)
      })
      .finally(() => {
        process.exit(1)
      })
  })
