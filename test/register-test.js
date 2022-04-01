/* eslint-env mocha */
'use strict'

const { expect } = require('./harness')
const extension = require('antora-navigator-extension')

describe('register', () => {
  const listeners = []

  beforeEach(() => {
    extension.register.call({ once: (eventName, listener) => listeners.push({ eventName, listener }) })
  })

  it('should register listener with beforePublish event', () => {
    expect(listeners).to.have.lengthOf(1)
    expect(listeners[0].eventName).to.equal('beforePublish')
    expect(listeners[0].listener).to.be.instanceOf(Function)
  })
})
