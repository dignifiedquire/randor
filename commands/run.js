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
    },
    size: {
      type: 'boolean',
      default: false,
      desc: 'Log the repo size every second'
    },
    parallel: {
      type: 'number',
      alias: 'p',
      default: 1,
      desc: 'How many parallel operations to execute'
    },
    write: {
      type: 'boolean',
      alias: 'w',
      default: true,
      desc: 'Should the operations be stored to disk'
    },
    read: {
      type: 'boolean',
      alias: 'r',
      default: false,
      desc: 'Should the operations be read from disk'
    },
    operations: {
      type: 'string',
      alias: 'o',
      desc: 'Whitelist specific operations'
    },
    daemon: {
      type: 'string',
      default: '',
      desc: 'JSON.parse\'able string of configuration to be passed to the daemon'
    }
  },

  run (limit, berserk, size, parallel, write, read, operations, daemon) {
    let gauge = new Gauge()
    let counter = 0
    const runners = [
      emoji('cat2'),
      emoji('cat2'),
      emoji('cat2')
    ].join('  ')

    if (operations) {
      operations = operations.split(',').map((op) => op.trim())
    }

    if (berserk) {
      console.log(`Let's do this, berserk style! ${emoji('scream_cat')} ${emoji('scream_cat')} ${emoji('scream_cat')}`)
      limit = undefined

      gauge.show(runners, 1)
    } else {
      console.log(`Let's do this, ${limit} times! ${emoji('joy_cat')}`)

      gauge.show(runners, 0.0001)
    }

    let daemonOpts = {}
    if (daemon) {
      daemonOpts = JSON.parse(daemon)
    }

    randor(limit, size, parallel, write, read, operations, daemonOpts)
      .each(() => {
        counter++

        if (berserk) {
          gauge.show(`${runners}  ${counter}`)
        } else {
          gauge.show(`${runners}  ${counter}/${limit}`, counter / limit)
        }
      })
      .stopOnError((err) => {
        console.error(`IPFS fails ${emoji('crying_cat_face')}`)
        console.error(err)
        console.error(err.stack)
        process.exit(1)
      })
      .done(() => {
        gauge.hide()
        console.log(`IPFS is awesome ${emoji('smiley_cat')}`)
        process.exit()
      })
  }
})
