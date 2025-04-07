const { StatusCodes } = require("http-status-codes");
const { adminService } = require("../service");
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
}
module.exports = new AdminController();
