const Joi = require('joi');

class CommentsValidator {
  createCommentValidator = (data) => {
    const createCommentSchema = Joi.object(
      {
        comment: Joi.string().min(2).required(),
        ip: Joi.string().required(),
        audioId: Joi.string().required(),
      },
    );
  
    const validatorResponse = createCommentSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }

  getCommentsValidator = (data) => {
    const getCommentsSchema = Joi.object(
      {
        page: Joi.number().min(1).allow(null),
        limit: Joi.number().min(1).allow(null),
        audioId: Joi.string().required(),
      },
    );
  
    const validatorResponse = getCommentsSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new CommentsValidator()
