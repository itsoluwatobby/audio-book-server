const express = require('express');
const { googleFormController } = require('../controller');

const googleFormRoutes = express.Router();

googleFormRoutes.post(
  '/submit',
  (req, res, next) => googleFormController.submitForm(req, res, next),
);

googleFormRoutes.get(
  '/fetch',
  (req, res, next) => googleFormController.getSubmissions(req, res, next),
);

googleFormRoutes.put(
  '/update/:id',
  (req, res, next) => googleFormController.updateInfo(req, res, next),
);

googleFormRoutes.get(
  '/submission/:deviceId',
  (req, res, next) => googleFormController.getUserSubmission(req, res, next),
);

googleFormRoutes.post(
  '/delete/:id',
  (req, res, next) => googleFormController.deleteRsvp(req, res, next),
);

module.exports = googleFormRoutes;
