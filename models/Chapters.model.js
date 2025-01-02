const mongoose = require("mongoose");

const Chapter = {
  chapter: { type: Number, default: 1 },
  link: { type: String },
  filename: { type: String },
  duration: { type: String },
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
    chapters: [Chapter],
  },
  { timestamps: true },
);
module.exports = mongoose.model('chapter', ChapterSchema);
