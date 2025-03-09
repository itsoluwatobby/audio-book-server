const { appConfigRepository } = require('../repository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
  throwBadRequestError,
  throwNotFoundError,
  throwServerError,
  throwConflictError,
  throwForbiddenError,
} = require('../utils/throwErrors');
const { appConfigValidators } = require('../validators');

class AppConfigServices {
  
  async initiateSetup() {
    const dup = await appConfigRepository.getAppConfig();
    if (dup) console.log('App Config already completed');
    else {
      const appConfig = await appConfigRepository.setupAppConfig({ name: 'Lovely Audios' });
      if (!appConfig) {
        console.log('Error setting up');
        return false;
      }
      console.log('Setup completed');
      return true
    }
  }

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
  
  async addPassword(reqBody) {
    console.log('Setting up appConfig password');
    const validatorResponse = appConfigValidators.passwordValidator(reqBody);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
    
    const appConfig = await appConfigRepository.getAppConfig(true);
    if (!appConfig) throwConflictError('App Config not found');
    
    if (appConfig.email !== reqBody.email) return throwForbiddenError('Unauthorized access');

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);
    appConfig.password = hashedPassword;
    await appConfig.save();

    const { password, ...rest } = appConfig._doc;
    return rest;
  }

  async login(reqBody) {
    console.log('Authentication user...');
    const validatorResponse = appConfigValidators.passwordValidator(reqBody);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const appConfig = await appConfigRepository.getAppConfig(true);
    if (!appConfig) throwConflictError('App Config not found');
    
    if (appConfig.email !== reqBody.email) return throwForbiddenError('Unauthorized access');

    const match = await bcrypt.compare(reqBody.password, appConfig.password);
    if (!match) throwForbiddenError('Bad credentials');

    appConfig.isLoggedIn = true;
    appConfig.sessionId = crypto.randomBytes(16).toString('hex');
    await appConfig.save();

    const { password, ...rest } = appConfig._doc;
    return rest;
  }
  
  async logout() {
    console.log('Logging user out...');
    
    const appConfig = await appConfigRepository.getAppConfig(true);
    if (!appConfig) throwConflictError('App Config not found');
    
    appConfig.isLoggedIn = false;
    appConfig.sessionId = null;
    await appConfig.save();

    const { password, ...rest } = appConfig._doc;
    return rest;
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
