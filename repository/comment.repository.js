const { Comments } = require("../models");

const initQuery = {
  limit: 10,
  page: 1,
};

class CommentRepository {
  async createComment(newComment) {
    return Comments.create(newComment);
  }

  async getComments(query = initQuery) {
    const { page, limit, ...rest } = query;
    const comments = await Comments.paginate(rest, { page, limit });
    return comments;
  }

  async getComment(commentId) {
    return Comments.findById(commentId);
  }

  async deleteComment(commentId) {
    return Comments.deleteOne({ id: commentId });
  }
}
module.exports = new CommentRepository();
