const mongoose = require("mongoose");
const config = require(".");

exports.DBConnection = async () => {
  try {
    await mongoose.connect(config.DB_URL);
    console.log('DB connected');
  } catch (error) {
    console.log(`An Error occurred, Error - ${error.message}`);
  }
};
