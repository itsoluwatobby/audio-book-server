const { appConfigRepository } = require('../repository');
const {
  throwNotFoundError,
  throwServerError,
  throwConflictError,
} = require('../utils/throwErrors');
const { appConfigValidators } = require('../validators');

class AppConfigServices {
  async setupAppConfig(reqBody) {
    console.log('Setup appConfig');
    const validatorResponse = appConfigValidators.updateAppConfigValidator(reqBody);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const dup = await appConfigRepository.getAppConfig();
    if (dup) throwConflictError('App Config already completed');

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
    const validatorResponse = appConfigValidators.updateAppConfigValidator(reqBody);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const appConfig = await appConfigRepository.editAppConfig(reqBody);

    return appConfig;
  }
}
module.exports = new AppConfigServices();
