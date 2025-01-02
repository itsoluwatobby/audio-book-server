const multer = require('multer');
const express = require('express');
const path = require('path');
const audioServices = require('../service/audio.services');

const audioRoutes = express.Router();

const storage = multer.diskStorage(
  {
    destination: function(_, file, cb) {
      if (file.fieldname === 'thumbnail') cb(null, 'uploads/thumbnails/')
      else if (file.fieldname === 'audio') cb(null, 'uploads/audio/');
      else cb(new Error('Invalid file type'));
    },
    filename: function(_, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  }
)

const upload = multer({ storage });
const uploadFields = [
  { name: 'audio', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]


audioRoutes.get(
  '/',
  (req, res) => audioServices.getAudios(req, res),
);

audioRoutes.post(
  '/upload',
  upload.fields(uploadFields),
  (req, res) => audioServices.uploadFile(req, res),
);

audioRoutes.post(
  '/create',
  (req, res) => audioServices.createAudio(req, res),
);

audioRoutes.get(
  '/file/:audioId',
  (req, res) => audioServices.getAudioFile(req, res),
);

audioRoutes.get(
  '/stream/:fileName',
  (req, res) => audioServices.streamAudio(req, res),
);
module.exports = audioRoutes;
