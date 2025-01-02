const { ReasonPhrases } = require('http-status-codes');
const { ErrorNames } = require('../config');
const {
  createBadRequestError,
  createConflictError,
  createForbiddenError,
  createMethodNotAllowedError,
  createNotAcceptableError,
  createNotFoundError,
  createUnauthorizedError,
  createUnprocessableEntityError,
} = require('../errors');
const { CustomError } = require('../errors');

exports.throwBadRequestError = (message) => {
  throw createBadRequestError(message);
};

exports.throwConflictError = (message) => {
  throw createConflictError(message);
};

exports.throwMethodNotAllowedError = (message) => {
  throw createMethodNotAllowedError(message);
};

exports.throwNotFoundError = (message) => {
  throw createNotFoundError(message);
};

exports.throwUnauthorizedError = (message) => {
  throw createUnauthorizedError(message || 'Unauthorized access.');
};

exports.throwUnprocessableEntityError = (message) => {
  throw createUnprocessableEntityError(message);
};

exports.throwForbiddenError = (message) => {
  throw createForbiddenError(message);
};

exports.throwNotAcceptableError = (message) => {
  throw createNotAcceptableError(message);
};

exports.throwServerError = (message) => {
  throw new CustomError(`${message || ReasonPhrases.INTERNAL_SERVER_ERROR}:${ErrorNames.SERVERERROR}`);
};