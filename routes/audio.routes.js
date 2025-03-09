const express = require('express');
const { audioController } = require('../controller');
const { audioServices } = require('../service');

const audioRoutes = express.Router();

audioRoutes.get(
  '/',
  (req, res, next) => audioController.getAudios(req, res, next),
);

audioRoutes.post(
  '/upload',
  (req, res, next) => audioController.uploadFile(req, res, next),
);

audioRoutes.post(
  '/create',
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

audioRoutes.patch(
  '/like/:audioId',
  (req, res, next) => audioController.likeAudiobook(req, res, next),
);

audioRoutes.put(
  '/rate',
  (req, res, next) => audioController.rateAudio(req, res, next),
);

audioRoutes.get(
  '/user',
  (req, res, next) => audioController.getCurrentUser(req, res, next),
);
module.exports = audioRoutes;
