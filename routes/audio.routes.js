const multer = require('multer');
const express = require('express');
const path = require('path');
const { audioController } = require('../controller');
const { audioServices } = require('../service');

const audioRoutes = express.Router();

const storage = multer.diskStorage(
  {
    destination: function(_, file, cb) {
      if (file.fieldname === 'thumbnail') cb(null, 'uploads/thumbnail/')
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
  (req, res, next) => audioController.getAudios(req, res, next),
);

audioRoutes.post(
  '/upload',
  upload.fields(uploadFields),
  (req, res, next) => audioController.uploadFile(req, res, next),
);

audioRoutes.post(
  '/create',
  upload.fields(uploadFields),
  (req, res, next) => audioController.createAudio(req, res, next),
);

audioRoutes.get(
  '/file/:audioId',
  (req, res, next) => audioController.getAudioFile(req, res, next),
);

audioRoutes.get(
  '/stream/:filename',
  (req, res, next) => audioServices.streamAudio(req, res, next),
);

audioRoutes.delete(
  '/delete/:audioId',
  (req, res, next) => audioController.deleteAudio(req, res, next),
);
module.exports = audioRoutes;
