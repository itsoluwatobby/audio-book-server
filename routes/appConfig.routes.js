const express = require('express');
const { appConfigController } = require('../controller');

const appConfigRoutes = express.Router();

appConfigRoutes.get(
  '/',
  (req, res, next) => appConfigController.getAppConfig(req, res, next),
);
appConfigRoutes.post(
  '/',
  (req, res, next) => appConfigController.setupAppConfig(req, res, next),
);
appConfigRoutes.put(
  '/',
  (req, res, next) => appConfigController.updateAppConfig(req, res, next),
);
module.exports = appConfigRoutes;
