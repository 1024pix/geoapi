import assert from 'assert'
import net from 'net'
import request from 'request-promise-native'
import startServer from './server'

const port = 9999

describe('#startServer', function() {
  before(`start server`, async function() {
    await startServer(port)
  })

  it(`should have started a web server on the specified port`, async function() {
    assert.equal(true, await isPortTaken(port))
  })

  it(`should successfully pull /me`, async function() {
    const response = await request.get(`http://localhost:${port}/me`, { json: true })
    assert.deepEqual(response, {})
  })
})

// https://gist.github.com/whatl3y/64a08d117b5856c21599b650c4dd69e6
async function isPortTaken(port) {
  return await new Promise((resolve, reject) => {
    const tester = net.createServer()
    tester.once('error', err => {
      if (err.code != 'EADDRINUSE')
        return reject(err)
      resolve(true)
    })
    .once('listening', () => tester.once('close', () => resolve(false)).close())
    .listen(port)
  })
}
