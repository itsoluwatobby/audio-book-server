const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ErrorNames: require('./errorNames'),
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  appId: 'lovely-audio-225105',
};
