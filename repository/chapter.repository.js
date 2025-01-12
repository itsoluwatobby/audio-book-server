const { ChapterModel } = require("../models");
const { throwNotFoundError, throwUnprocessableEntityError, throwServerError } = require("../utils/throwErrors");
const fs = require('fs');

class ChapterRepository {
  async createChapter(sessionId, chapter) {
    try {
      const findChapter = await this.getChapterBySessionId(sessionId)
      if (findChapter) {
        if (!chapter.episode) chapter.episode = 1 + findChapter.chapters?.length;
        findChapter.chapters.push(chapter);
        await findChapter.save();
        return findChapter;
      }
      return ChapterModel.create({ sessionId, chapters: [chapter] });
    } catch (err) {
      await this.deleteFile('audio', chapter.filename);
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
    const episode = chapter.chapters.find((chap) => chap.id === episodeId);
    if (!episode) throwNotFoundError('Episode not found');
    
    await this.deleteFile('audio', episode.filename);

    return ChapterModel.findOneAndUpdate(
      { sessionId: sessionId },
      { $pull: { chapters: { _id: episodeId } } },
      { new: true },
    )
  }

  async deleteFile(path, filename) {
    if (!filename) return;
    const filePath = `uploads/${path}/${filename}`;
    if (!fs.existsSync(filePath)) return;
  
    fs.unlink(filePath, (err) => {
      if (err) {
        const msg = `Error deleting chapter ${path}`;
        console.log(msg);
        throwUnprocessableEntityError(msg);
      }
    });
    console.log(`Chapter with name ${filename} removed`);
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
