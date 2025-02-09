const mongoose = require("mongoose");

const AppConfigSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Lovely Audios' },
    appId: { type: String, trim: true, unique: true },
    email: { type: String, trim: true, default: 'crazywandyte@gmail.com' },
    about: { type: String, trim: true },
    message: { type: String, trim: true },
    password: { type: String, select: false },
    isLoggedIn: { type: Boolean, default: false },
    channel: { type: String, default: 'https://youtube.com/@lovelygrl?si=pY_GvHKhCVCkn4Gp' },
    genres: {
      type: Array,
      default: ['romance', 'fantasy', 'adventure', 'sci-fi', 'dark-romance'],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('appConfig', AppConfigSchema);
