/**
 * Create a lump instance. Just an alias of `new ClayLump(config)`
 * @function create
 * @returns {ClayLumpActor}  - A ClayLumpActor instance
 */
'use strict'

const ClayLumpActor = require('./clay_lump_actor')

/** @lends clayLump */
function create (...args) {
  return new ClayLumpActor(...args)
}

module.exports = create
