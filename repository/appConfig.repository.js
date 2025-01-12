const config = require("../config");
const { AppConfigModel } = require("../models");

class AppConfigRepository {
  async setupAppConfig(newAppConfig) {
    return AppConfigModel.create({ ...newAppConfig, appId: config.appId });
  }

  async getAppConfig() {
    return AppConfigModel.findOne({ appId: config.appId });
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
