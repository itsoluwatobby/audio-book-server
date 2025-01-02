/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
// const { ErrorNames } = require('../config');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    // this.name = ErrorNames.UNAUTHORIZEDERROR;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

const createUnauthorizedError = (message) => new UnauthorizedError(message);

module.exports = { createUnauthorizedError, UnauthorizedError };