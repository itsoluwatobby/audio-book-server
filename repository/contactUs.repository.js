const { ContactUs } = require("../models");

const initQuery = {
  limit: 10,
  page: 1,
};

class ContactUsRepository {
  async createContact(newContact) {
    return ContactUs.create(newContact);
  }

  async getContacts(query = initQuery) {
    const { page, limit, ...rest } = query;
    const contacts = await ContactUs.paginate(
      rest,
      {
        page,
        limit,
        lean: true,
        sort: { createdAt: -1 },
      },
    );
    return contacts;
  }

  async getContact(contactId) {
    return ContactUs.findById(contactId);
  }

  async markAsResponded({ contactId, repliedTo = true }) {
    return ContactUs.findOneAndUpdate(
      { id: contactId },
      { $set: { repliedTo } },
      { new: true },
    )
  }

  async deleteContact(contactId) {
    return ContactUs.deleteOne({ id: contactId });
  }
}
module.exports = new ContactUsRepository();
