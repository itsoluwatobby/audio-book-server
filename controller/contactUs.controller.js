const { StatusCodes } = require("http-status-codes");
const { contactUsServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class ContactUsController {
  async createContact(req, res, next) {
    try {
      const data = await contactUsServices.createContact(req.body, req.ipAddress);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Contact successfully submitted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ContactUsController();
