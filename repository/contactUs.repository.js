const { ContactUs } = require("../models");

const initQuery = {
  limit: 10,
  page: 1,
};

class ContactUsRepository {
  async createAudio(newContact) {
    return ContactUs.create(newContact);
  }

  async getContacts(query = initQuery) {
    const { page, limit, ...rest } = query;
    const contacts = await ContactUs.paginate(rest, { page, limit });
    return contacts;
  }

  async getContact(contactId) {
    return ContactUs.findById(contactId);
  }

  async markAsRead(contactId) {
    return ContactUs.findOneAndUpdate(
      { id: contactId },
      { $set: { read: true } },
      { new: true },
    )
  }

  async deleteContact(contactId) {
    return ContactUs.deleteOne({ id: contactId });
  }
}
module.exports = new ContactUsRepository();
