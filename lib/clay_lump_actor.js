/**
 * Actor to wrap clay lump
 * @class ClayLumpActor
 */
'use strict'

const { SugoActor, CallerEvents } = require('sugo-actor')
const { clone } = require('asobj')
const co = require('co')
const { LEAVE, JOIN } = CallerEvents
const { fromLump: resourceModulesFromLump } = require('./resourceful/modularize_resource')

/** @lends ClayLumpActor */
class ClayLumpActor extends SugoActor {
  constructor (lump, options = {}) {
    const callerKeys = new Set()
    const modules = resourceModulesFromLump(lump, {
      onEvent (event, { data, module }) {
        if (module.$emitter) {
          let only = Array.from(callerKeys)
          module.emit(event, data, { only })
        }
      }
    })
    const config = Object.assign({
      modules: modules
    }, clone(options, { without: [] }))
    super(config)

    const s = this
    s.on(JOIN, ({ caller, messages = {} }) => co(function * () {
      // TODO Validate token
      callerKeys.add(caller.key)
    }))
    s.on(LEAVE, ({ caller, messages = {} }) => co(function * () {
      callerKeys.delete(caller.key)
    }))
  }
}

module.exports = ClayLumpActor
