const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, 'name required'] },
    comment: { type: String, trim: true, required: [true, 'comment is required']  },
    ip: { type: String, default: 'unknonwn' },
    audioId: { type: String },
    like: { type: Array, default: [] },
  },
  { timestamps: true },
);
CommentsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', CommentsSchema);
