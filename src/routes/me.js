import geoip from 'geoip-lite'

export default function meRoute(req, res) {
  const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || "").split(',')
  const ip = realClientIpAddress[0]
  const location = geoip.lookup(ip)

  if (location === null) {
    res.json({})
    return;
  }

  res.json({ country: location.country })
};
