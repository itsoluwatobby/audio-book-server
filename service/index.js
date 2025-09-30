const chapterServices = require('./chapter.services')
const audioServices = require('./audio.services');
const appConfigServices = require('./appConfig.services');
const adminService = require('./admin.service');
const commentServices = require('./comment.services');
const contactUsServices = require('./contactUs.services');
const bookServices = require('./book.service');
const googleFormServices = require('./googleForm.services');

module.exports = {
  chapterServices,
  audioServices,
  appConfigServices,
  adminService,
  commentServices,
  contactUsServices,
  bookServices,
  googleFormServices,
};
