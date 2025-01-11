const { StatusCodes } = require("http-status-codes");
const { audioServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class AudioController {
  async uploadFile(req, res, next) {
    try {
      const data = await audioServices.uploadFile(req.files, req.body);
      
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
  
  async getAudioFile(req, res, next) {
    try {
      const data = await audioServices.getAudioFile(req.params);

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
  
  async getAudios(_req, res, next) {
    try {
      const data = await audioServices.getAudios();

      responseBody(
        {
          res,
          statusCode: StatusCodes.ACCEPTED,
          message: 'Audios successfully retrieved',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
  
  // async streamAudio(req, res, next) {
  //   try {
  //     const data = await audioServices.streamAudio(req.params, req.headers);
  //     responseBody(
  //       {
  //         res,
  //         statusCode: StatusCodes.CREATED,
  //         message: 'File successfully uploaded',
  //         data,
  //       }
  //     )
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
module.exports = new AudioController();
