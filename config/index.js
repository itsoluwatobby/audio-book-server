const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ErrorNames: require('./errorNames'),
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  CONFIG_EMAIL: process.env.CONFIG_EMAIL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  appId: process.env.appId,
};
