/**
 * SUGOActor to wrap Clay-Lump
 * @module clay-lump-actor
 * @version 1.0.2
 */

'use strict'

const ClayLumpActor = require('./clay_lump_actor')
const create = require('./create')

let lib = create.bind(this)

Object.assign(lib, ClayLumpActor, {
  ClayLumpActor
})

module.exports = lib
