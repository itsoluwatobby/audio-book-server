const { bookServices } = require("../service");
const { responseBody } = require("../utils/responseBody");

class BookController {
  async getBookRating(req, res, next) {
    try {
      const data = await bookServices.getBookRating(req.query);

      responseBody(
        {
          res,
          message: `Rating for ${req.query?.title} retrieved`,
          data,
        },
      );
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new BookController();
