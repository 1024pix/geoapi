import assert from 'assert'
import sinon from 'sinon'
import geoip from 'geoip-lite'

import meRoute from './me'

let geoipStub

describe('#meRoute', function() {
  before(function() {
    geoipStub = sinon.stub(geoip, 'lookup');
  })

  beforeEach(function() {
    geoipStub.reset();
  })

  it(`calls geoip with user ip and respond with result`, async function() {
    // given
    const req = { ip: '192.168.0.1', headers: {} }
    const res = { json: sinon.stub() }
    geoipStub.returns({ ip: '192.168.0.1', country: 'FR', city: 'Rochefourchat' })

    // when
    meRoute(req, res)

    // then
    sinon.assert.calledOnceWithExactly(geoipStub, '192.168.0.1')
    sinon.assert.calledOnceWithExactly(res.json, {
      ip: '192.168.0.1',
      country: 'FR',
      city: 'Rochefourchat'
    })
  })

  it(`calls geoip with ip from user behind proxy and responds with result`, async function() {
    // given
    const req = { ip: '192.168.0.255', headers: { 'x-forwarded-for': '192.168.0.2, 192.168.0.254' } }
    const res = { json: sinon.stub() }
    geoipStub.returns({ ip: '192.168.0.2', country: 'BE', city: 'Durbuy' })

    // when
    meRoute(req, res)

    // then
    sinon.assert.calledOnceWithExactly(geoipStub, '192.168.0.2')
    sinon.assert.calledOnceWithExactly(res.json, {
      ip: '192.168.0.2',
      country: 'BE',
      city: 'Durbuy'
    })
  })

  it(`calls geoip with ip and responds {} if location is unknown`, async function() {
    // given
    const req = { ip: '192.168.0.3', headers: {} }
    const res = { json: sinon.stub() }
    geoipStub.returns(null)

    // when
    meRoute(req, res)

    // then
    sinon.assert.calledOnceWithExactly(geoipStub, '192.168.0.3')
    sinon.assert.calledOnceWithExactly(res.json, {})
  })

  after(function() {
    geoipStub.restore();
  })
})
