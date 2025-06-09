const { StatusCodes } = require("http-status-codes");
const { commentServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class CommentsController {
  async createComment(req, res, next) {
    try {
      const data = await commentServices.createComment(req.body, req.ipAddress);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Comment successfully submitted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async likeAudiobookComment(req, res, next) {
    try {
      const data = await commentServices.likeAudiobookComment(req.params, req.ipAddress);

      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Audio comment modified successfully',
          data,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async getComment(req, res, next) {
    try {
      const data = await commentServices.getComment(req.params);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Comment successfully retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const data = await commentServices.getComments(req.query);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Comments successfully retrieved',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const data = await commentServices.deleteComment(req.params);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Comment successfully deleted',
          data,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CommentsController();
