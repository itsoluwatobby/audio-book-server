const { StatusCodes } = require("http-status-codes");
const { googleFormServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class GoogleFormController {
  async submitForm (req, res, next) {
    try {
      const data = await googleFormServices.submitForm(req.body);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Form submitted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
  
  async getUserSubmission (req, res, next)  {
    try {
      const data = await googleFormServices.getUserSubmission(req.params.deviceId);
      
      responseBody(
        {
          res,
          message: 'Submission retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
  
  async getSubmissions (req, res, next) {
    try {
      const data = await googleFormServices.getSubmissions(req.body, req.ipAddress);
      
      responseBody(
        {
          res,
          message: 'Submissions successfully retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new GoogleFormController();