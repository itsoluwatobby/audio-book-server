const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const config = require('../config');

function isCustomError(error) {
  return typeof error === 'object' && 'statusCode' in error;
}

exports.errorHandler = (err, req, res, next) => {
  let errorObject = {};
  console.log(
    {
      message: err.message,
      name: err.name,
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    },
  )

  // Handle custom application errors
  if (err && isCustomError(err)) {
    errorObject.status = err?.statusCode;
    errorObject.message = err.message.split(':')[0];
    errorObject.name = err.message?.split(':')[1] ?? err?.name;
  }

   // Handle JSON parse errors
   if (
    err
    && (err.type === 'entity.parse.failed' || err.name === 'SyntaxError')
  ) {
    errorObject.status = err?.statusCode || err?.status;
    errorObject.name = config.ErrorNames.UNPROCESSABLEENTITYERROR;
    errorObject.message = err.type === 'entity.parse.failed'
      ? 'Invalid JSON format in the request body. Please ensure there are no trailing commas.'
      : 'Syntax Error: Invalid data format.';
    console.error(`JSON parse error: ${err.message}. Request body: ${req.body}`);
  }

  // Fallback for unexpected errors
  if (!errorObject.status) {
    errorObject.status = StatusCodes.INTERNAL_SERVER_ERROR;
    errorObject.name = 'InternalServerError';
    errorObject.message = err?.message ?? 'An unexpected error occurred.';
  }

  // Default to internal server error if status is not set
  const statusCode = errorObject?.status || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json(
    {
      timestamp: new Date().toString(),
      error: {
        statusCode,
        success: false,
        message: errorObject?.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      },
    }
  );
}
