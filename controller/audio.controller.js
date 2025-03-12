const { StatusCodes } = require("http-status-codes");
const { audioServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class AudioController {
  async uploadFile(req, res, next) {
    try {
      const data = await audioServices.uploadFile(req.body);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'File successfully uploaded',
          data,
        }
      )
    } catch (error) {
      next(error);
    }
  }
  
  async createAudio(req, res, next) {
    try {
      const data = await audioServices.createAudio(req.body);

      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Audio successfully created',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }

  async rateAudio(req, res, next) {
    try {
      const data = await audioServices.rateAudio(
        {
          ...req.body,
          ipAddress: req.ip,
        },
      );

      responseBody(
        {
          res,
          statusCode: StatusCodes.ACCEPTED,
          message: 'Audio rating completed',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }

  async likeAudiobook(req, res, next) {
    try {
      const data = await audioServices.likeAudiobook(
        {
          ...req.params,
          ipAddress: req.ip,
        },
      );

      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Audio successfully created',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
  async getCurrentUser(req, res, next) {
    try {
      const data = await audioServices.getCurrentUser(req.ip);

      responseBody(
        {
          res,
          message: 'User retrieved',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
  
  async getAudioFile(req, res, next) {
    try {
      const data = await audioServices.getAudioFile(
        {
          ...req.params,
          ipAddress: req.ip,
        },
      );

      responseBody(
        {
          res,
          statusCode: StatusCodes.ACCEPTED,
          message: 'Audio successfully retrieved',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
  
  async getAudios(req, res, next) {
    try {
      const data = await audioServices.getAudios(req.query);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Audios successfully retrieved',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
  
  async getAudioRecommendations(req, res, next) {
    try {
      const data = await audioServices.getAudioRecommendations(req.query);

      responseBody(
        {
          res,
          statusCode: StatusCodes.OK,
          message: 'Recommended audios retrieved',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
  
  async deleteAudio(req, res, next) {
    try {
      const data = await audioServices.deleteAudio(req.params.audioId);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'Audio successfully deleted',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new AudioController();
