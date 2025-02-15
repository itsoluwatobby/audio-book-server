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

appConfigRoutes.post(
  '/setup',
  (req, res, next) => appConfigController.addPassword(req, res, next),
);

appConfigRoutes.post(
  '/login',
  (req, res, next) => appConfigController.login(req, res, next),
);

appConfigRoutes.post(
  '/logout',
  (req, res, next) => appConfigController.logout(req, res, next),
);
module.exports = appConfigRoutes;
