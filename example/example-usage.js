'use strict'

const clayLump = require('clay-lump')
const clayLumpActor = require('clay-lump-actor')

async function tryExample () {
  const lump = clayLump('lump01', {})

  const lumpActor = clayLumpActor(lump, {
    port: 3000,
    hostname: 'localhost'
  })

  await lumpActor.connect()
}

tryExample().catch((err) => console.error(err))