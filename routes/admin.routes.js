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

adminRoutes.patch(
  '/contact-repliedTo',
  (req, res, next) => adminControllers.markAsResponded(req, res, next),
);

adminRoutes.get(
  '/contact/:contactId',
  (req, res, next) => adminControllers.getContact(req, res, next),
);

adminRoutes.get(
  '/contacts',
  (req, res, next) => adminControllers.getContacts(req, res, next),
);

adminRoutes.delete(
  '/contact/:contactId',
  (req, res, next) => adminControllers.deleteContact(req, res, next),
);
module.exports = adminRoutes;
