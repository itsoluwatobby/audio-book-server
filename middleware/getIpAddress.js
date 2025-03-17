const requestIp = require('request-ip');

exports.getIpAddress = (req, _res, next) => {
  const ipAddress = requestIp.getClientIp(req) ?? "unknown";
  req.ipAddress = ipAddress;
  next();
}