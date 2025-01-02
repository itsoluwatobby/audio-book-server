const { BadRequestError, createBadRequestError } = require('./BadRequest');
const { ConflictError, createConflictError } = require('./Conflict');
const { createMethodNotAllowedError, MethodNotAllowedError } = require('./MethodNotAllowed');
const { createNotFoundError, NotFoundError } = require('./NotFound');
const { createUnauthorizedError, UnauthorizedError } = require('./Unauthorized');
const { createUnprocessableEntityError, UnprocessableEntityError } = require('./UnprocessableEntity');
const { ForbiddenError, createForbiddenError } = require('./Forbidden');
const { createNotAcceptableError, NotAcceptableError } = require('./Unacceptable');
const { CustomError } = require('./CustomError');

module.exports = {
  BadRequestError,
  CustomError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  NotAcceptableError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
  createBadRequestError,
  createNotFoundError,
  createMethodNotAllowedError,
  createConflictError,
  createUnauthorizedError,
  createForbiddenError,
  createUnprocessableEntityError,
  createNotAcceptableError,
};