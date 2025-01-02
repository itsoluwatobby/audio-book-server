const { createNotFoundError } = require('../errors');

// eslint-disable-next-line no-unused-vars
const routeNotFound = (req, _res) => {
  throw createNotFoundError(`${req.method}-${req.url} does not exist`);
};
module.exports = routeNotFound;