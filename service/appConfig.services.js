const { appConfigRepository } = require('../repository');
const { throwNotFoundError, throwServerError } = require('../utils/throwErrors');

class AppConfigServices {
  async setupAppConfig(reqBody) {
    console.log('Setup appConfig');

    const appConfig = await appConfigRepository.setupAppConfig(reqBody);
    if (!appConfig) throwServerError('Error setting up');

    return appConfig;
  }

  async getAppConfig() {
    console.log('Get appConfig');

    const appConfig = await appConfigRepository.getAppConfig();
    if (!appConfig) throwNotFoundError('AppConfig not found');

    return appConfig;
  }
 
  async updateAppConfig(reqBody) {
    console.log('Updating appConfig');

    const appConfig = await appConfigRepository.editAppConfig(reqBody);

    return appConfig;
  }
}
module.exports = new AppConfigServices();
