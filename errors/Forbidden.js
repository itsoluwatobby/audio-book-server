/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.FORBIDDENERROR;
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

const createForbiddenError = (message) => new ForbiddenError(message);

module.exports = { ForbiddenError, createForbiddenError };