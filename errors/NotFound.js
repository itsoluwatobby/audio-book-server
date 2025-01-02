/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.RESOURCENOTFOUND;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
const createNotFoundError = (message) => new NotFoundError(message);
module.exports = { createNotFoundError, NotFoundError };