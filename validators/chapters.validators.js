const Joi = require('joi');

class ChapterValidator {

  idValidator = (data, keyName) => {
    const idValidatorSchema = Joi.object(
      {
        [keyName]: Joi.string().required()
          .messages(
            {
              'any.required': `${keyName} is required`,
            }
          ),
      }
    );
  
    const validatorResponse = idValidatorSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
  
  removeAudioValidator = (data) => {
    const removeAudioSchema = Joi.object(
      {
        sessionId: Joi.string().required(),
        episodeId: Joi.string().required(),
      },
    );
  
    const validatorResponse = removeAudioSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new ChapterValidator()
