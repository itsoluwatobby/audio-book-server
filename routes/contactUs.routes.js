const express = require('express');
const { contactUsController } = require('../controller');

const contactUsRoutes = express.Router();

contactUsRoutes.post(
  '/',
  (req, res, next) => contactUsController.createComment(req, res, next),
);
module.exports = contactUsRoutes;
