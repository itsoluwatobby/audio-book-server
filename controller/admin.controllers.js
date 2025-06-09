const { StatusCodes } = require("http-status-codes");
const { adminService, contactUsServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class AdminController {
  async getDashboard(_req, res, next) {
    try {
      const data = await adminService.getDashboard();

      responseBody(
        {
          res,
          message: 'Dashboard analytics retrieved',
          data,
        },
      );
    } catch (error) {
      next(error);
    }
  }
  
  async toggleAudioStatus(req, res, next) {
    try {
      const data = await adminService.toggleAudioStatus(req.params.audioId);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: `Audiobook marked as ${data.isPublic ? 'public' : 'private'}`,
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
  
  async deleteAudio(req, res, next) {
    try {
      const data = await adminService.deleteAudio(req.params.audioId);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Audio successfully deleted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async markAsResponded(req, res, next) {
    try {
      const data = await contactUsServices.markAsResponded(req.body);

      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: `Contact${data.repliedTo ? '' : ' not'} marked as responded to`,
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async getContact(req, res, next) {
    try {
      const data = await contactUsServices.getContact(req.params);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Contact successfully retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req, res, next) {
    try {
      const data = await contactUsServices.getContacts(req.query);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Contacts successfully retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const data = await contactUsServices.deleteContact(req.params);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Contact successfully deleted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AdminController();
