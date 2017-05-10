/**
 * Test case for clayLumpActor.
 * Runs with mocha.
 */
'use strict'

const ClayLumpActor = require('../lib/clay_lump_actor.js')
const clayLump = require('clay-lump')
const sugoHub = require('sugo-hub')
const sugoCaller = require('sugo-caller')
const { ok, equal } = require('assert')
const aport = require('aport')
const co = require('co')

describe('clay-lump-actor', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Clay lump actor', () => co(function * () {
    const lump = clayLump('testing-lump', {})
    lump.resource('User')
    lump.resource('Org')
    const port = yield aport()
    const hub = sugoHub({
      localActors: {
        db: new ClayLumpActor(lump, {})
      }
    })

    yield hub.listen(port)
    {
      const caller = sugoCaller({ port })
      const db = yield caller.connect('db')
      ok(db)

      const User = db.get('User')
      const Org = db.get('Org')
      ok(User)
      ok(Org)

      let org01 = yield Org.create({ name: 'org01' })
      let user01 = yield User.create({ name: 'user01', org: org01 })
      equal(user01.name, 'user01')
      yield Org.update(org01.id, { v: 2 })
      let user01AsFirst = yield User.first({ name: user01.name })
      equal(user01AsFirst.name, 'user01')
      equal(user01AsFirst.org.v, 2)

      yield caller.disconnect()

    }

    yield hub.close()
  }))
})

/* global describe, before, after, it */
