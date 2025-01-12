const { StatusCodes } = require("http-status-codes");

exports.responseBody = ({ res, message, data, statusCode = StatusCodes.OK }) => {
  res.status(statusCode).json(
    {
      timestamp: new Date().toString(),
      statusCode,
      message,
      data,
    },
  );
};
