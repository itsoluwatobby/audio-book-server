const Joi = require('joi');

class AppConfigValidator {
  updateAppConfigValidator = (data) => {
    const updateAppConfigSchema = Joi.object(
      {
        name: Joi.string().allow(null),
        genre: Joi.array().min(1).items(Joi.string().required()).allow(null),
        email: Joi.string().allow(null),
        channel: Joi.string().uri({ scheme: ['https'] }).allow(null),
      },
    );
  
    const validatorResponse = updateAppConfigSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new AppConfigValidator()
