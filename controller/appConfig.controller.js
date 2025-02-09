const { StatusCodes } = require("http-status-codes");
const { appConfigServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class AppConfigController {
  async setupAppConfig(req, res, next) {
    try {
      const data = await appConfigServices.setupAppConfig(req.body);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'App configuration setup complete',
          data,
        }
      )
    } catch (error) {
      next(error);
    }
  }
  
  async getAppConfig(_req, res, next) {
    try {
      const data = await appConfigServices.getAppConfig();

      responseBody(
        {
          res,
          message: 'App configuration successfully retrieved',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }

  async addPassword(req, res, next) {
    try {
      const data = await appConfigServices.addPassword(req.body);

      responseBody(
        {
          res,
          message: 'App configuration password successfully setup',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
  
  async login(req, res, next) {
    try {
      const data = await appConfigServices.login(req.body);

      responseBody(
        {
          res,
          message: 'App configuration login credential confirmed',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
  
  async updateAppConfig(req, res, next) {
    try {
      const data = await appConfigServices.updateAppConfig(req.body);

      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message: 'App configurations successfully modified',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new AppConfigController();
