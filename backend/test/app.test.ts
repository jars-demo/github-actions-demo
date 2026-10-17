import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { readInfo, route } from '../src/app.js'

const info = { name: 'pulse', version: '1.2.3', commit: 'abc123' }

describe('route', () => {
  it('returns ok on /health', () => {
    const reply = route('GET', '/health', info)

    assert.deepEqual(reply, { status: 200, body: { status: 'ok' } })
  })

  it('returns the version and commit the build came from on /api/version', () => {
    const reply = route('GET', '/api/version', info)

    assert.deepEqual(reply.body, info)
  })

  it('greets a valid name', () => {
    const reply = route('GET', '/api/greet?name=Ada%20Lovelace', info)

    assert.deepEqual(reply.body, { message: 'Hello, Ada Lovelace!' })
  })

  it('rejects a missing name with 400 INVALID_NAME', () => {
    const reply = route('GET', '/api/greet', info)

    assert.equal(reply.status, 400)
    assert.deepEqual(reply.body, {
      error: { code: 'INVALID_NAME', message: 'Give a name of 1 to 40 letters, like ?name=Ada.' },
    })
  })

  it('rejects markup in the name', () => {
    const reply = route('GET', '/api/greet?name=%3Cscript%3E', info)

    assert.equal(reply.status, 400)
  })

  it('accepts a 40 character name and rejects 41', () => {
    const forty = route('GET', `/api/greet?name=${'a'.repeat(40)}`, info)
    const fortyOne = route('GET', `/api/greet?name=${'a'.repeat(41)}`, info)

    assert.equal(forty.status, 200)
    assert.equal(fortyOne.status, 400)
  })

  it('returns 404 NOT_FOUND for an unknown path', () => {
    const reply = route('GET', '/nope', info)

    assert.equal(reply.status, 404)
    assert.deepEqual(reply.body, { error: { code: 'NOT_FOUND', message: 'No route for /nope.' } })
  })

  it('returns 405 with an Allow header for other methods', () => {
    const reply = route('POST', '/health', info)

    assert.equal(reply.status, 405)
    assert.deepEqual(reply.headers, { allow: 'GET, HEAD' })
  })
})

describe('readInfo', () => {
  it('stamps the build with the first 12 characters of the CI commit', () => {
    const result = readInfo({ GITHUB_SHA: '0123456789abcdef0123' }, '1.0.0')

    assert.equal(result.commit, '0123456789ab')
  })

  it('falls back to "local" outside CI', () => {
    const result = readInfo({}, '1.0.0')

    assert.equal(result.commit, 'local')
  })
})
