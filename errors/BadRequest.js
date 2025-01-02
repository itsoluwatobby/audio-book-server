const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.BADREQUEST;
    this.statusCode = StatusCodes.BAD_REQUEST;
    // this.isOperational = true;
  }
}
const createBadRequestError = (message) => new BadRequestError(message);

module.exports = { createBadRequestError, BadRequestError };