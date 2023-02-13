import geoip from 'geoip-lite'
import bunyan from 'bunyan'

import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default function meRoute(req, res) {
  const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || "").split(',')
  const ip = realClientIpAddress[0]
  const location = geoip.lookup(ip)

  if (location === null) {
    res.json({})
    log.info({ country: "-" }, 'Could not match IP address with country')
    return;
  }

  res.json({ country: location.country })
  log.info({ country: location.country }, 'IP address matched with country')
};
