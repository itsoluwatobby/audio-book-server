const config = require("../config");
const { AppConfigModel } = require("../models");

class AppConfigRepository {
  async setupAppConfig(newAppConfig) {
    return AppConfigModel.create({ ...newAppConfig, appId: config.appId });
  }

  async getAppConfig(withPassword = false) {
    return AppConfigModel.findOne({ appId: config.appId })
      .select(
        withPassword
        ? '+password +isLoggedIn +sessionId +email'
        : '-password -isLoggedIn -sessionId -email',
      );
  }

  async editAppConfig(updatedInfo) {
    const config = await AppConfigModel.findOneAndUpdate(
      { appId: config.appId },
      updatedInfo,
      { new: true },
    );

    return {
      genres: config.genres,
      name: config.name,
      channel: config.channel,
    };
  }
}
module.exports = new AppConfigRepository();
