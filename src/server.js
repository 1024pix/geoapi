import http from 'http'
import express from 'express'
import cors from 'cors'
import bunyan from 'bunyan'
import geoip from 'geoip-lite'
import config from './config'

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

      app.get('/me', function meRoute(req, res) {
        // https://devcenter.heroku.com/articles/http-routing#heroku-headers
        const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || "").split(',')
        const ip = realClientIpAddress[realClientIpAddress.length - 1]
        res.json({ ip, ...geoip.lookup(ip) })
      })

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
