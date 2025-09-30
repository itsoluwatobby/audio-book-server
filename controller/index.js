const chapterController = require('./chapter.controller');
const audioController = require('./audio.controller');
const appConfigController = require('./appConfig.controller');
const adminControllers = require('./admin.controllers');
const commentControllers = require('./comment.controllers');
const contactUsController = require('./contactUs.controller');
const bookController = require('./book.controller');
const googleFormController = require('./googleForm.controller');

module.exports = {
  audioController,
  chapterController,
  appConfigController,
  adminControllers,
  commentControllers,
  contactUsController,
  bookController,
  googleFormController,
};
