const axios = require('axios');
const {
  throwBadRequestError,
  throwServerError,
} = require('../utils/throwErrors');

class BookServices {

  async getBookRating(query) {
    console.log(`Rating for ${query?.title} retrieved`);

    const { title, authors } = query;

    if (!title && !authors) throwBadRequestError('title or author is required')
    
    try {
      const goodReadsBaseURL = "https://www.goodreads.com/book/auto_complete";
      const response = await axios.get(goodReadsBaseURL, {
        params: { format: "json", q: `${title} by ${authors}` },
      });
      const result = response.data[0];

      return {
        rating: result?.avgRating,
        ratingsCount: result?.ratingsCount,
      };
    } catch (err) {
      throwServerError(err.message);
    }
  } 
}
module.exports = new BookServices();