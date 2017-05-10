/**
 * @function modularizeResource
 */
'use strict'

const { Module } = require('sugo-actor')
const { ResourceEvents } = require('clay-constants')
const debug = require('debug')('clay:lump:actor:resources')

const defaultMethodNames = [ 'one',
  'list',
  'create',
  'update',
  'destroy',
  'oneBulk',
  'listBulk',
  'createBulk',
  'updateBulk',
  'destroyBulk',
  'cursor',
  'first' ]

const defaultEventNamess = [
  ResourceEvents.ENTITY_CREATE,
  ResourceEvents.ENTITY_CREATE_BULK,
  ResourceEvents.ENTITY_UPDATE,
  ResourceEvents.ENTITY_UPDATE_BULK,
  ResourceEvents.ENTITY_DESTROY,
  ResourceEvents.ENTITY_DESTROY_BULK
]

/** @lends modularizeResource */
function modularizeResource (resource, options = {}) {
  let {
    eventNames = [ ...defaultEventNamess ],
    methodNames = [ ...defaultMethodNames ],
    onEvent,
    decorate = (module) => module
  } = options
  let methods = methodNames.reduce((methods, name) => Object.assign(methods, {
    [name]: resource[ name ].bind(resource)
  }), {})
  let module = new Module(decorate(methods))
  for (let event of eventNames) {
    resource.on(event, (data) => {
      debug(resource.name, event, JSON.stringify(data))
      onEvent && onEvent(event, { data, module })
    })
  }
  return module
}

Object.assign(modularizeResource, {
  fromLump (lump, opitons = {}) {
    const { knownResources: resources } = lump
    let { excludes = [] } = opitons
    return resources
      .filter((resource) => !excludes.includes(resource.name))
      .reduce((modules, resources) => Object.assign(modules, {
        [resources.name]: modularizeResource(resources, opitons)
      }), {})
  }
})

module.exports = modularizeResource
