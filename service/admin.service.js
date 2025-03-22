const { audioRepository, chapterRepository } = require('../repository');
const { AudioModel } = require('../models');
const { chapterValidators } = require('../validators');
const { throwBadRequestError } = require('../utils/throwErrors');

class AdminServices {
  async getDashboard() {
    console.log('Fetching platform dashboard information');

    const audios = await AudioModel.find().countDocuments();
    const views = await audioRepository.getTotalCounts('views');
    const likes = await audioRepository.getTotalCounts('likes');
    const comments = await audioRepository.getTotalCounts('comments');
    const stats = await this.#getMonthlyStats();

    return {
      cardDetails: {
        audios,
        views,
        likes,
        comments,
      },
      analytics: { ...stats },
    };
  }

  async #getMonthlyStats() {
    const stats = await AudioModel.aggregate([
      // { $match: { isPublic: true } }, // Optional
      { $group: { 
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          totalViews: { $sum: { $size: '$views' } },
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } }
        } },
      { $project: { 
          month: { $concat: [
            { $toString: '$_id.year' }, 
            '-', 
            { $cond: { if: { $lt: ['$_id.month', 10] }, then: { $concat: ['0', { $toString: '$_id.month' }] }, else: { $toString: '$_id.month' } } }
          ] },
          totalViews: 1, totalLikes: 1, totalComments: 1 
        } },
      { $sort: { month: 1 } }
    ]);

    console.log(`Monthly stats: ${stats.length} months`);

    return stats;
  }

  async deleteAudio(audioId) {
    console.log('Removing audio books');
    const validatorResponse = chapterValidators.idValidator({ audioId }, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
    
    const audio = await audioRepository.getAudio(audioId);
    if (!audio) throwNotFoundError('Audio not found');

    const chapter = await chapterRepository.getChapter(audio.chapterId);
    if (chapter) {
      await Promise.allSettled(chapter.chapters.map(async (chap) => {
        await chapterRepository.deleteFile(chap?.publicId);
      }));
      await chapter.deleteOne();
    }

    await chapterRepository.deleteFile(audio.thumbnail, 'image');
    await audio.deleteOne();

    return { id: audio.id };
  }
  
  async toggleAudioStatus(audioId) {
    console.log('Toggling audiobook status');
    const validatorResponse = chapterValidators.idValidator({ audioId }, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
    
    const audio = await audioRepository.getAudio(audioId);
    if (!audio) throwNotFoundError('Audio not found');

    audio.isPublic = !audio.isPublic;
    await audio.save()

    return audio;
  }
}
module.exports = new AdminServices();
