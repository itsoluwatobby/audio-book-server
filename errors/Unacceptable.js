/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class NotAcceptableError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.NOTACCEPTABLEERROR;
    this.statusCode = StatusCodes.NOT_ACCEPTABLE;
  }
}
const createNotAcceptableError = (message) => new NotAcceptableError(message);

module.exports = { createNotAcceptableError, NotAcceptableError };