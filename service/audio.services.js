const fs = require('fs');
const {
  audioRepository,
  chapterRepository,
} = require('../repository');
const {
  throwServerError,
  throwBadRequestError,
  throwNotFoundError,
} = require('../utils/throwErrors');
const helper = require('../helpers/helper');
const chapterServices = require('./chapter.services');

class AudioServices {
  async uploadFile(files, reqBody) {
    const filename = files.audio[0].filename;

    const { sessionId } = reqBody;
    const chapter = helper.jsonParseValue(reqBody.chapter);
    chapter.filename = filename;

    const result = await chapterRepository.createChapter(sessionId, chapter);
    if (!result) throwBadRequestError('Error creating chapter');
    
    console.log('File successfully uploaded');
    
    return result;
  }

  async uploadThumbnail(files, reqBody) {
    console.log('File successfully uploaded');
    const filename = files.thumbnail[0].filename;
    
    // const chapter = await chapterRepository.createChapter(
    //   { ...reqBody, chapter: { ...reqBody.chapter, filename } },
    // );
    // if (!chapter) throwBadRequestError('Error creating chapter');
    
    return filename;
  }
  
  async createAudio(body) {
    console.log('Creating audio file and update chapter with audioId');

    const { sessionId, ...rest } = body;
    const audio = await audioRepository.createAudio(rest);
    if (!audio) throwBadRequestError('Error creating audio');

    const chapter = await chapterRepository.updateChapterWithAudioId(sessionId, audio.id);
    if (!chapter) throwBadRequestError('Error updating chapter with audioId');
    
    return audio;
  }

  async getAudioFile(params) {
    console.log('Getting audio file');

    const audio = await audioRepository.getAudio(params.audioId);
    if (!audio) throwNotFoundError('Audio not found');

    return audio
  }
 
  async getAudios() {
    console.log('Getting audio files');
    const audios = await audioRepository.getAudioFiles({});

    return audios;
  }

  async streamAudio(req, res) {
    console.log(`Stream Audio with audioId ${fileName}`);
    
    const fileName = req.params.fileName
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
  }
}
module.exports = new AudioServices();