const express = require('express');
const { adminControllers } = require('../controller');

const adminRoutes = express.Router();

adminRoutes.get(
  '/',
  (req, res, next) => adminControllers.getDashboard(req, res, next),
);

adminRoutes.delete(
  '/delete/:audioId',
  (req, res, next) => adminControllers.deleteAudio(req, res, next),
);

adminRoutes.patch(
  '/make-private/:audioId',
  (req, res, next) => adminControllers.toggleAudioStatus(req, res, next),
);
module.exports = adminRoutes;
