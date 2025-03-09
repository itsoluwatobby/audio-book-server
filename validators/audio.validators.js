const Joi = require('joi');

class AudioValidator {
  uploadAudioValidator = (data) => {
    const uploadAudioValidatorSchema = Joi.object(
      {
        chapter: Joi.object(
          {
            episode: Joi.number().min(0).required(),
            duration: Joi.string().required(),
            publicId: Joi.string().required(),
            filename: Joi.string().required(),
            link: Joi.string().required(),
          },
        ).required(),
        sessionId: Joi.string().required(),
      },
    );
  
    const validatorResponse = uploadAudioValidatorSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
  
  createAudioValidator = (data) => {
    const createAudioSchema = Joi.object(
      {
        chapterId: Joi.string().required(),
        thumbnail: Joi.string().required(),
        author: Joi.string().required(),
        genre: Joi.array().min(1).items(Joi.string().required()).required(),
        note: Joi.string().allow(null),
        about: Joi.string().required(),
        title: Joi.string().required(),
        reference: Joi.object({
          siteName: Joi.string().allow(null),
          link: Joi.string().allow(null),
        }).allow(null),
      },
    );
  
    const validatorResponse = createAudioSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
  
  getAudiosValidator = (data) => {
    const getAudiosSchema = Joi.object(
      {
        page: Joi.number().min(1).allow(null),
        limit: Joi.number().min(1).allow(null),
        isPublic: Joi.boolean().allow(null),
      },
    );
  
    const validatorResponse = getAudiosSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new AudioValidator()
