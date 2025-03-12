const rateLimiter = require('express-rate-limit');
const { throwTooManyRequestsError } = require('../utils/throwErrors');

exports.RequestRateLimiter = rateLimiter({
  windowMS: 5 * 60 * 1000, // max of 200 requests in 5 minutes
  max: 200,
  handler: (req) => {
    throwTooManyRequestsError(
      `Too many requests from this IP, please try again after ${(Math.ceil(req.rateLimit.resetTime - Date.now()) / (60 * 1000)).toFixed(2)} minutes`);
  }
});