'use strict'

const Command = require('ronin').Command
const Gauge = require('gauge')

const emoji = require('../lib/utils').emoji
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
    const runners = [
      emoji('cat2'),
      emoji('cat2'),
      emoji('cat2')
    ].join('  ')

    if (berserk) {
      console.log(`Let's do this, berserk style! ${emoji('scream_cat')} ${emoji('scream_cat')} ${emoji('scream_cat')}`)
      limit = undefined

      gauge.show(runners, 1)
    } else {
      console.log(`Let's do this, ${limit} times! ${emoji('joy_cat')}`)

      gauge.show(runners, 0.0001)
    }

    randor(limit)
      .each(() => {
        counter++

        if (berserk) {
          gauge.show(`${runners}  ${counter}`)
        } else {
          gauge.show(`${runners}  ${counter}/${limit}`, counter / limit)
        }
      })
      .errors((err) => {
        if (err) {
          console.error(`IPFS fails ${emoji('crying_cat_face')}`)
          console.error(err)
          console.error(err.stack)
          process.exit(1)
        }
      })
      .done(() => {
        console.log(`IPFS is awesome ${emoji('smiley_cat')}`)
        process.exit()
      })
  }
})
