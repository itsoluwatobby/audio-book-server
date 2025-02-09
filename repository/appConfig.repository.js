const config = require("../config");
const { AppConfigModel } = require("../models");

class AppConfigRepository {
  async setupAppConfig(newAppConfig) {
    return AppConfigModel.create({ ...newAppConfig, appId: config.appId });
  }

  async getAppConfig(withPassword = false) {
    return AppConfigModel.findOne({ appId: config.appId }).select(withPassword ? '+password' : '-password');
  }

  async editAppConfig(updatedInfo) {
    return AppConfigModel.findOneAndUpdate(
      { appId: config.appId },
      updatedInfo,
      { new: true },
    )
  }
}
module.exports = new AppConfigRepository();
