const mongoose = require("mongoose");

const Episode = {
  episode: { type: Number, default: 1 },
  link: { type: String },
  filename: { type: String },
  duration: { type: String },
  publicId: { type: String, default: null },
};

const ChapterSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
    },
    audioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'audios',
    },
    chapters: [Episode],
  },
  { timestamps: true },
);
module.exports = mongoose.model('chapter', ChapterSchema);
