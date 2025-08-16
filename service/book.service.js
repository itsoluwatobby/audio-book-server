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
        params: { format: "json", q: title },
      });
      
      const result = response.data?.map((book) => {
        return {
          rating: book?.avgRating,
          ratingsCount: book?.ratingsCount,
          author: book?.author,
          title: book?.title,
          description: book?.description,
          bookTitleBare: book?.bookTitleBare,
          rank: book?.rank,
          numPages: book?.numPages,
          imageUrl: book?.imageUrl,
          source: 'goodreads'
        };
      });

      return result;
    } catch (err) {
      throwServerError(err.message);
    }
  } 
}
module.exports = new BookServices();
// https://www.goodreads.com/book/auto_complete?format=json&q=the+hatin