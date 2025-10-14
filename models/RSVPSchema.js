const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const RSVPSchema = new mongoose.Schema(
  {
    date: { type: String, default: null },
    name: { type: String, default: null, trim: true },
    phone: { type: String, default: null, trim: true },
    attending: { type: String, default: "YES", trim: true },
    quests: { type: Number, default: null },
    message: { type: String, default: null, trim: true },
    email: { type: String, default: null, trim: true },
    deviceFingerprint: { type: String, default: null, index: true },
    cardId: { type: Number, default: null },
    fila: { type: Number, default: 0 },
    gele: { type: Number, default: 0 },
    seats: { type: Array, default: [] }
  },
  { timestamps: true },
);
RSVPSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('rsvp', RSVPSchema);
