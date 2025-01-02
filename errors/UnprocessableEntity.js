/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class UnprocessableEntityError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.UNPROCESSABLEENTITYERROR;
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}
const createUnprocessableEntityError = (message) => new UnprocessableEntityError(message);

module.exports = { createUnprocessableEntityError, UnprocessableEntityError };