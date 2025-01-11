const mongoose = require("mongoose");

const AudioSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: [true, 'Audio title is required'] },
    author: { type: String, trim: true, required: [true, 'Audio author is required'] },
    chapters: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chapters',
    },
    thumbnail: { type: String, trim: true, required: true },
    about: { type: String, trim: true, required: [true, 'Audio description is required'] },
    genre: { type: String, trim: true, required: [true, 'Genre is required'] },
    isPublic: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    note: { type: String, default: '' },
    reference: { 
      siteName: { type: String, default: '' },
      link: { type: String, default: '' },
    }
  },
  { timestamps: true },
);
module.exports = mongoose.model('audio', AudioSchema);
