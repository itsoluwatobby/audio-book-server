const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const ContactUsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, 'name required'] },
    email: { type: String, trim: true },
    message: { type: String, trim: true, required: [true, 'Message is required']  },
    ip: { type: String, default: 'unknonwn' },
    read: { type: Boolean, default: false },
    repliedTo: { type: Boolean, default: false },
  },
  { timestamps: true },
);
ContactUsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('contactus', ContactUsSchema);
