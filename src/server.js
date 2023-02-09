import http from 'http'
import express from 'express'
import cors from 'cors'
import bunyan from 'bunyan'

import config from './config'
import meRoute from './routes/me'

const log = bunyan.createLogger(config.logger.options)
const app = express()
const server = http.Server(app)

export default async function startServer(portToListenOn=config.server.port) {
  return await new Promise((resolve, reject) => {
    try {
      app.disable('x-powered-by')

      // https://expressjs.com/en/guide/behind-proxies.html
      app.set('trust proxy', 1)
      app.use(cors())

      app.get('/me', meRoute)

      app.use(function expressErrorHandler(err, req, res, next) {
        log.error('Express error handling', err)
        res.sendStatus(500)
      })

      server.listen(portToListenOn, () => {
        log.info(`listening on *: ${portToListenOn}`)
        resolve(app)
      })

    } catch(err) {
      log.error("Error starting server", err)
      reject(err)
    }
  })
}
