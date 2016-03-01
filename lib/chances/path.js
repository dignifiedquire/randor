'use strict'

const path = require('path')
const _ = require('lodash')

module.exports = (chance) => {
  chance.mixin({
    path (options) {
      options = _.defaults(options, {
        base: '/',
        segments: 2
      })

      const segments = _.range(options.segments).map(() => chance.syllable())
      segments.unshift(options.base)

      let res = path.join.apply(null, segments)
      if (options.dir) {
        res += path.sep
      } else if (options.ext) {
        res += options.ext
      }

      return res
    }
  })
}
