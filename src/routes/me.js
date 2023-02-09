import geoip from 'geoip-lite'

export default function meRoute(req, res) {
  const realClientIpAddress = (req.headers['x-forwarded-for'] || req.ip || "").split(',')
  const ip = realClientIpAddress[realClientIpAddress.length - 1]
  res.json({ ip, ...geoip.lookup(ip) })
};
