const express = require('express');
const { chapterController } = require('../controller');

const chapterRoutes = express.Router();

chapterRoutes.post(
  '/remove',
  (req, res, next) => chapterController.removeEpisodeFromChapter(req, res, next),
);
chapterRoutes.get(
  '/file/:audioId',
  (req, res, next) => chapterController.getChapters(req, res, next),
);
chapterRoutes.get(
  '/stream/:sessionId',
  (req, res, next) => chapterController.getChapter(req, res, next),
);
chapterRoutes.get(
  '/:chapterId',
  (req, res, next) => chapterController.getChapterById(req, res, next),
);
module.exports = chapterRoutes;
