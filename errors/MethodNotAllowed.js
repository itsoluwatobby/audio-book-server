/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.METHODNOTALLOWEDERROR;
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }
}
const createMethodNotAllowedError = (message) => new MethodNotAllowedError(message);

module.exports = { createMethodNotAllowedError, MethodNotAllowedError };