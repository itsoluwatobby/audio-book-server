const Joi = require('joi');

class AppConfigValidator {
  updateAppConfigValidator = (data) => {
    const updateAppConfigSchema = Joi.object(
      {
        name: Joi.string().allow(null),
        genres: Joi.array().min(1).items(Joi.string().required()).allow(null),
        channel: Joi.string().uri({ scheme: ['https'] }).allow(null),
      },
    );
  
    const validatorResponse = updateAppConfigSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
  
  passwordValidator = (data) => {
    const passwordSchema = Joi.object(
      {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    );
  
    const validatorResponse = passwordSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new AppConfigValidator();
