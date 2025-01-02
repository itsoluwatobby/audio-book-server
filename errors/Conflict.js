/* eslint-disable import/no-extraneous-dependencies */
const { StatusCodes } = require('http-status-codes');
const { ErrorNames } = require('../config');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = ErrorNames.RESOURCECONFLICTERROR;
    this.statusCode = StatusCodes.CONFLICT;
  }
}
const createConflictError = (message) => new ConflictError(message);

module.exports = { ConflictError, createConflictError };