const { contactUsRepository } = require("../repository");
const { chapterValidators, contactUsValidators } = require("../validators");
const {
  throwBadRequestError,
  throwNotFoundError,
  throwServerError,
} = require('../utils/throwErrors');

class ContactUsServices {
  async createContact(reqBody, ipAddress) {
    console.log(`Submitting a contact for user with ID - ${ipAddress}`);

    const data = { ...reqBody, ip: ipAddress };
    const validatorResponse = contactUsValidators.createContactValidator(data);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const contact = await contactUsRepository.createContact(data);
    if (!contact) return throwServerError('Error creating contact');

    return { id: contact._id };
  }

  async getContact(reqParams) {
    console.log(`Getting contact with ID - ${reqParams.contactId}`);

    const validatorResponse = chapterValidators.idValidator(reqParams, 'contactId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const contact = await contactUsRepository.getContact(reqParams.contactId);
    if (!contact) return throwNotFoundError('Contact not found');

    return contact;
  }

  async deleteContact(reqParams) {
    console.log(`Deleting contact with ID - ${reqParams.contactId}`);

    const validatorResponse = chapterValidators.idValidator(reqParams, 'contactId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const contact = await contactUsRepository.deleteContact(reqParams.contactId);
    if (!contact) return throwServerError('Error deleting contact');

    return { id: contact._id };
  }
  
  async markAsResponded(reqBody) {
    console.log(`Toggling contact status with ID - ${reqBody.contactId}`);

    const validatorResponse = chapterValidators.markAsRespondedValidator(reqBody);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const contact = await contactUsRepository.markAsResponded(reqBody);
    if (!contact) return throwServerError('Error updating contact status');

    return contact;
  }

  async getContacts(reqQuery) {
    console.log('Getting all contacts');
    const validatorResponse = contactUsValidators.getContactsValidator(reqQuery);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const contacts = await contactUsRepository.getContacts(reqQuery);

    return contacts;
  }
}
module.exports = new ContactUsServices();