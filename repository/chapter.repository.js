const ChapterModel = require("../models/Chapters.model");
const { throwNotFoundError, throwUnprocessableEntityError } = require("../utils/throwErrors");
const fs = require('fs');

class ChapterRepository {
  async createChapter(sessionId, chapter) {
    const findChapter = await this.getChapterBySessionId(sessionId)
    if (findChapter) {
      chapter.episode = 1 + findChapter.chapters?.length;
      findChapter.chapters.push(chapter);
      await findChapter.save();
      return findChapter;
    }
    return ChapterModel.create({ sessionId, chapters: [chapter] });
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
    const episode = chapter.chapters.find((chap) => chap.id === episodeId);
    if (!episode) throwNotFoundError('Episode not found');
    const filePath = `uploads/audio/${episode.filename}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        const msg = 'Error deleting chapter episode';
        console.log(msg);
        throwUnprocessableEntityError(msg);
      }
    });
    return ChapterModel.findOneAndUpdate(
      { sessionId: sessionId },
      { chapters: { $pull: { episodeId } } },
      { new: true },
    )
  }
  
  async updateChapterWithAudioId(sessionId, audioId) {
    return ChapterModel.findOneAndUpdate(
      { sessionId: sessionId },
      { audioId },
      { new: true },
    )
  }

  async deleteAudioChapter(chapterId) {
    return ChapterModel.deleteOne({ id: chapterId });
  }
}
module.exports = new ChapterRepository();
