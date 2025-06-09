const express = require('express');
const { bookController } = require('../controller');

const bookRoutes = express.Router();

bookRoutes.get(
  '/rating',
  (req, res, next) => bookController.getBookRating(req, res, next),
);
module.exports = bookRoutes;
