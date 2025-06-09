const { commentRepository, audioRepository } = require("../repository");
const { chapterValidators, commentValidators } = require("../validators");
const {
  throwBadRequestError,
  throwNotFoundError,
  throwServerError,
} = require('../utils/throwErrors');

class CommentServices {
  async createComment(reqBody, ipAddress) {
    console.log(`Submitting a comment for user with ID - ${ipAddress}`);

    const data = { ...reqBody, ip: ipAddress };
    const validatorResponse = commentValidators.createCommentValidator(data);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
    
    const comment = await commentRepository.createComment(data);
    if (!comment) return throwServerError('Error creating comment');
    
    await audioRepository.addCommentToAudio(reqBody.audioId, comment_id);

    return comment;
  }

  async getComment(reqParams) {
    console.log(`Getting comment with ID - ${reqParams.commentId}`);

    const validatorResponse = chapterValidators.idValidator(reqParams, 'commentId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const comment = await commentRepository.getComment(reqParams.commentId);
    if (!comment) return throwNotFoundError('Comment not found');

    return comment;
  }

  async deleteComment(reqParams) {
    console.log(`Deleting comment with ID - ${reqParams.commentId}`);

    const validatorResponse = chapterValidators.idValidator(reqParams, 'commentId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const comment = await commentRepository.getComment(reqParams.commentId);
    if (!comment) return throwServerError('Error deleting comment');

    await audioRepository.removeCommentFromAudio(comment._id, comment.audioId);
    await comment.deleteOne();

    return { id: comment._id };
  }

  async getComments(reqQuery) {
    console.log('Getting all comments');
    const validatorResponse = commentValidators.getCommentsValidator(reqQuery);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const comments = await commentRepository.getComments(reqQuery);

    return comments;
  }

  async likeAudiobookComment(reqParams, ipAddress) {
    console.log('Liking audio book comment with ID - ', reqParams.commentId);
    const validatorResponse = chapterValidators.idValidator(reqParams, 'commentId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const comment = await commentRepository.getComment(reqParams.commentId);
    if (!comment) return throwServerError('Error deleting comment');

    if (comment.likes.includes(ipAddress)) {
      comment.likes = comment.likes?.filter((like) => like !== ipAddress);
    } else {
      comment.likes.push(ipAddress);
    }
    await comment.save();

    return comment;
  }
}
module.exports = new CommentServices();