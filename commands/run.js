'use strict'

const Command = require('ronin').Command
const Gauge = require('gauge')

const randor = require('../lib')

module.exports = Command.extend({
  desc: 'Make IPFS cry',

  options: {
    limit: {
      type: 'number',
      alias: 'l',
      default: 100,
      desc: 'How many operations should be run'
    },
    berserk: {
      type: 'boolean',
      default: false,
      desc: 'Run forever, like you mean it'
    }
  },

  run (limit, berserk) {
    let gauge = new Gauge()
    let counter = 0

    if (berserk) {
      console.log('Let\'s do this, berserk style!')
      limit = undefined

      gauge.show('Executing', 1)
    } else {
      console.log('Let\'s do this, %s times!', limit)

      gauge.show('Executing', 0.0001)
    }

    randor(limit)
      .each(() => {
        counter++

        if (berserk) {
          gauge.show(`Executing: ${counter}`)
        } else {
          gauge.show(`Executing: ${counter}/${limit}`, counter / limit)
        }
      })
      .errors((err) => {
        if (err) {
          console.error('IPFS fails :cry:')
          console.error(err)
          console.error(err.stack)
          process.exit(1)
        }
      })
      .done(() => {
        console.log('IPFS is awesome :smiley_cat:')
        process.exit()
      })
  }
})
