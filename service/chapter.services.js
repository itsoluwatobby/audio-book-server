const { chapterRepository } = require('../repository');
const { throwNotFoundError } = require('../utils/throwErrors');

class ChapterServices {
  async removeEpisodeFromChapter(reqBody) {
    console.log('Removing episode from chapter');

    const { sessionId, episodeId } = reqBody;
    const chapter = await chapterRepository.removeEpisodeFromChapter(sessionId, episodeId);
    if (!chapter) throwNotFoundError('Error removing episode from chapter');

    return chapter;
  }

  async getChapter(sessionId) {
    console.log('Getting audio chapter');

    const chapter = await chapterRepository.getChapterBySessionId(sessionId);
    if (!chapter) throwNotFoundError('Chapter not found');

    return chapter;
  }
 
  async getChapters() {
    console.log('Getting chapters');

    const chapters = await chapterRepository.getChapters({});

    return chapters;
  }
}
module.exports = new ChapterServices();
