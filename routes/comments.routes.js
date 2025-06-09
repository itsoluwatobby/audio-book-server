const express = require('express');
const { commentControllers } = require('../controller');

const commentRoutes = express.Router();

commentRoutes.post(
  '/',
  (req, res, next) => commentControllers.createComment(req, res, next),
);

commentRoutes.get(
  '/get/:commentId',
  (req, res, next) => commentControllers.getComment(req, res, next),
);

commentRoutes.get(
  '/all',
  (req, res, next) => commentControllers.getComments(req, res, next),
);

commentRoutes.patch(
  '/like/:commentId',
  (req, res, next) => commentControllers.likeAudiobookComment(req, res, next),
);

commentRoutes.delete(
  '/delete/:commentId',
  (req, res, next) => commentControllers.deleteComment(req, res, next),
);
module.exports = commentRoutes;
