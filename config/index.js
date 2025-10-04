const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ErrorNames: require('./errorNames'),
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  CONFIG_EMAIL: process.env.CONFIG_EMAIL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  appId: process.env.appId,
  googleSheetBaseURL: process.env.GOOGLE_SHEET,
};
