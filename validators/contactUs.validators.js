const Joi = require('joi');

class ContactUsValidator {
  createContactValidator = (data) => {
    const createContactSchema = Joi.object(
      {
        name: Joi.string().required(),
        email: Joi.string().email().allow(null),
        message: Joi.string().min(2).required(),
        ip: Joi.string().required(),
      },
    );
  
    const validatorResponse = createContactSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }

  getContactsValidator = (data) => {
    const getContactsSchema = Joi.object(
      {
        page: Joi.number().min(1).allow(null),
        limit: Joi.number().min(1).allow(null),
        repliedTo: Joi.boolean().allow(null),
      },
    );
  
    const validatorResponse = getContactsSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }

  markAsRespondedValidator = (data) => {
    const markAsRespondedSchema = Joi.object(
      {
        contactId: Joi.string().required(),
        repliedTo: Joi.boolean().allow(null),
      },
    );
  
    const validatorResponse = markAsRespondedSchema.validate(data);
    return {
      valid: !validatorResponse.error,
      error: validatorResponse.error?.message,
    };
  }
}  
module.exports = new ContactUsValidator()
