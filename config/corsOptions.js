const config = require('.');

const AllowedOrigins = config.ALLOWED_ORIGINS?.split(',') ?? [];

exports.CorsOption = {
  origin: (origin, callback) => {
    // if (AllowedOrigins.includes(origin)) {
    if (AllowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(null, Error('NOT ALLOWED BY CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
