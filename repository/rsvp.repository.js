const { RSVP } = require("../models");

const initQuery = {
  limit: 300,
  page: 1,
};

class RSVPRepository {
  async create(newRsvp) {
    return RSVP.create(newRsvp);
  }

  async update(id, updateObj) {
    return RSVP.findOneAndDelete({ _id: id }, { $set: { ...updateObj } }, { new: true });
  }

  async find(query = initQuery) {
    const { page, search, limit } = query;

    const searchQuery = {};
    if (search) {}

    const rsvps = await RSVP.paginate(
      searchQuery,
      {
        page,
        limit,
        lean: true,
        sort: { createdAt: -1 },
      },
    );
  
    const { docs, ...meta } = rsvps;
    return { docs, meta };
  }

  async findOne(deviceFingerprint) {
    return RSVP.findOne({ deviceFingerprint });
  }

  async getRsvpByQuery(query) {
    return RSVP.findOne({ ...query });
  }

  async getLastSubmission() {
    return RSVP.findOne().sort({ createdAt: -1 }).lean();
  }

  async deleteRsvp(id) {
    return RSVP.deleteOne({ id });
  }
}
module.exports = new RSVPRepository();
