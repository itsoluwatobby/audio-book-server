const { StatusCodes } = require("http-status-codes");
const { chapterServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class ChapterController {
  async removeEpisodeFromChapter(req, res, next) {
    try {
      const data = await chapterServices.removeEpisodeFromChapter(req.body);
      
      responseBody(
        {
          res,
          statusCode: StatusCodes.CREATED,
          message:  `Episode ${req.body.episodeId} removed from chapter successfully`,
          data,
        }
      )
    } catch (error) {
      next(error);
    }
  }
  
  async getChapter(req, res, next) {
    try {
      const data = await chapterServices.getChapter(req.params.sessionId);

      responseBody(
        {
          res,
          message: 'Chapter successfully retrieved',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
 
  async getChapterById(req, res, next) {
    try {
      const data = await chapterServices.getChapterById(req.params.chapterId);

      responseBody(
        {
          res,
          message: 'Chapter successfully retrieved',
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
  
  async getChapters(_req, res, next) {
    try {
      const data = await chapterServices.getChapters();

      responseBody(
        {
          res,
          message: 'Chapters successfully retrieved',
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new ChapterController();
