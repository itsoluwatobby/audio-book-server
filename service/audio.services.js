const fs = require('fs');
const {
  audioRepository,
  chapterRepository,
} = require('../repository');
const {
  throwBadRequestError,
  throwNotFoundError,
} = require('../utils/throwErrors');
const helper = require('../helpers/helper');
const {
  audioValidators,
  chapterValidators,
} = require('../validators');

class AudioServices {
  async uploadFile(files, reqBody) {
    const filename = files.audio[0].filename;

    const { sessionId } = reqBody;
    const chapter = helper.jsonParseValue(reqBody.chapter);

    const validatorResponse = audioValidators.uploadAudioValidator({ ...reqBody, chapter });
    if (validatorResponse.error) {
      await chapterRepository.deleteFile('audio', filename);
      return throwBadRequestError(validatorResponse.error);
    }

    chapter.filename = filename;

    const result = await chapterRepository.createChapter(sessionId, chapter);
    if (!result) throwBadRequestError('Error creating chapter');
    
    console.log('File successfully uploaded');
    
    return result;
  }
  
  async createAudio(body, files) {
    console.log('Creating audio file and update chapter with audioId');
    const filename = files.thumbnail[0].filename;

    const { reference, genre, ...rest } = body;
    rest.reference = helper.jsonParseValue(reference);
    rest.genre = helper.jsonParseValue(genre);
    
    const validatorResponse = audioValidators.createAudioValidator(rest);
    if (validatorResponse.error) {
      await chapterRepository.deleteFile('thumbnail', filename);
      return throwBadRequestError(validatorResponse.error);
    }

    rest.thumbnail = filename;

    const audio = await audioRepository.createAudio(rest);
    if (!audio) {
      await chapterRepository.deleteFile('thumbnail', filename);
      throwBadRequestError('Error creating audio');
    }
    
    const chapter = await chapterRepository.updateChapterWithAudioId(rest.chapterId, audio.id);
    if (!chapter) {
      await chapterRepository.deleteFile('thumbnail', filename);
      await audio.deleteOne();
      throwBadRequestError('Error updating chapter with audioId');
    }
    
    audio.chapterId = chapter.id;
    await audio.save();

    return audio;
  }

  async getAudioFile(reqBody) {
    console.log('Getting audio file');
    const validatorResponse = chapterValidators.idValidator(reqBody, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const audio = await audioRepository.getAudio(reqBody.audioId);
    if (!audio) throwNotFoundError('Audio not found');
    
    return audio
  }
 
  async getAudios(reqQuery) {
    console.log('Getting audio files');
    const validatorResponse = audioValidators.getAudiosValidator(reqQuery);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const audios = await audioRepository.getAudioFiles(reqQuery);

    return audios;
  }
  
  async deleteAudio(audioId) {
    console.log('Removing audio files');
    const validatorResponse = chapterValidators.idValidator({ audioId }, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
    
    const audio = await audioRepository.getAudio(audioId);
    if (!audio) throwNotFoundError('Audio not found');

    const chapter = await chapterRepository.getChapter(audio.chapterId);
    if (chapter) {
      await Promise.allSettled(chapter.chapters.map(async (chap) => {
        await chapterRepository.deleteFile('audio', chap?.filename);
      }));
      await chapter.deleteOne();
    }

    await chapterRepository.deleteFile('thumbnail', audio?.thumbnail);
    await audio.deleteOne();

    return { id: audio.id };
  }

  async streamAudio(req, res, next) {
    try {
      const fileName = req.params.filename
      console.log(`Stream Audio with audioId ${fileName}`);
      const validatorResponse = chapterValidators.idValidator(req.params, 'filename');
      if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);
      
      const path = 'uploads/audio/' + fileName;
  
      const stat = fs.statSync(path);
      
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
  
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg',
        };
  
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new AudioServices();