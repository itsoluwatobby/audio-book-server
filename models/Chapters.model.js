const mongoose = require("mongoose");

const Episode = {
  episode: { type: Number, unique: [true, 'episode sequence must be unique'], default: 1 },
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
    chapters: [Episode],
  },
  { timestamps: true },
);
module.exports = mongoose.model('chapter', ChapterSchema);
