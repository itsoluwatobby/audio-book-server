const { ChapterModel } = require("../models");
const { throwNotFoundError, throwServerError } = require("../utils/throwErrors");
const cloudinary = require('cloudinary');
const config = require('../config/index');

class ChapterRepository {
  async createChapter(sessionId, chapter) {
    try {
      const findChapter = await this.getChapterBySessionId(sessionId)
      if (findChapter) {
        // if (!chapter.episode) chapter.episode = 1 + findChapter.chapters?.length;
        chapter.episode = 1 + findChapter.chapters?.length;
        findChapter.chapters.push(chapter);
        await findChapter.save();
        return findChapter;
      }
      return ChapterModel.create({ sessionId, chapters: [chapter] });
    } catch (err) {
      await this.deleteFile(chapter.publicId);
      throwServerError(err.message);
    }
  }

  async getChapters(query = {}) {
    const chapters = await ChapterModel.find(query);
    return chapters;
  }

  async getChapter(id) {
    return ChapterModel.findById(id);
  }
  
  async getChapterBySessionId(sessionId) {
    return ChapterModel.findOne({ sessionId });
  }

  async addChapter(sessionId, chapter) {
    return ChapterModel.findOneAndUpdate(
      { sessionId },
      { $push: { chapters: chapter } },
      { new: true },
    )
  }
  
  async removeEpisodeFromChapter(sessionId, episodeId) {
    const chapter = await this.getChapterBySessionId(sessionId);
    const episode = chapter.chapters?.find((chap) => chap.id === episodeId);
    if (!episode) throwNotFoundError('Episode not found');
    
    await this.deleteFile(episode.publicId);

    return ChapterModel.findOneAndUpdate(
      { sessionId: sessionId },
      { $pull: { chapters: { _id: episodeId } } },
      { new: true },
    )
  }

  async deleteFile(publicId, resource_type = 'video') {
    if (!publicId) return;

    let resourceId = publicId;

    if (resource_type === 'image') {
      const values = publicId?.split('/');
      resourceId = values[values?.length - 1]?.split('.')[0]
    }

    cloudinary.v2.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_KEY,
      api_secret: config.CLOUDINARY_SECRET,
    });
  
    const result = await cloudinary.v2.uploader.destroy(resourceId, { resource_type });
    if (result.result === 'ok') return true;
    return false;
  }
  
  async updateChapterWithAudioId(chapterId, audioId) {
    return ChapterModel.findOneAndUpdate(
      { _id: chapterId },
      { audioId },
      { new: true },
    )
  }

  async deleteAudioChapter(chapterId) {
    return ChapterModel.deleteOne({ id: chapterId });
  }
}
module.exports = new ChapterRepository();
