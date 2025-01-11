const { StatusCodes } = require("http-status-codes");

exports.responseBody = ({ res, message, data, statusCode = StatusCodes.ACCEPTED }) => {
  res.status(statusCode).json(
    {
      timestamp: new Date().toString(),
      statusCode,
      message,
      data,
    },
  );
};
