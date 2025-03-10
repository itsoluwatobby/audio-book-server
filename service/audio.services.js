const fs = require('fs');
const {
  audioRepository,
  chapterRepository,
} = require('../repository');
const {
  throwBadRequestError,
  throwNotFoundError,
} = require('../utils/throwErrors');
const {
  audioValidators,
  chapterValidators,
} = require('../validators');
// import config from '../config';

class AudioServices {
  async uploadFile(reqBody) {
    const { sessionId } = reqBody;

    const validatorResponse = audioValidators.uploadAudioValidator(reqBody);
    if (validatorResponse.error) {
      await chapterRepository.deleteFile(reqBody.chapter.publicId);
      return throwBadRequestError(validatorResponse.error);
    }

    const result = await chapterRepository.createChapter(sessionId, reqBody.chapter);
    if (!result) throwBadRequestError('Error creating chapter');
    
    console.log('File successfully uploaded');
    
    return result;
  }
  
  async createAudio(body) {
    console.log('Creating audio file and update chapter with audioId');
    const thumbnail = body.thumbnail;
    
    const validatorResponse = audioValidators.createAudioValidator(body);
    if (validatorResponse.error) {
      await chapterRepository.deleteFile(thumbnail, 'image');
      return throwBadRequestError(validatorResponse.error);
    }

    const audio = await audioRepository.createAudio(body);
    if (!audio) {
      await chapterRepository.deleteFile(thumbnail, 'image');
      throwBadRequestError('Error creating audio');
    }
    
    const chapter = await chapterRepository.updateChapterWithAudioId(body.chapterId, audio.id);
    if (!chapter) {
      await chapterRepository.deleteFile(thumbnail, 'image');
      await audio.deleteOne();
      throwBadRequestError('Error updating chapter with audioId');
    }
    
    audio.chapterId = chapter.id;
    await audio.save();

    return audio;
  }

  async getAudioFile(reqBody) {
    console.log('Getting audio file');
    const validatorResponse = chapterValidators.idValidator({ audioId: reqBody?.audioId }, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const audio = await audioRepository.getAudio(reqBody.audioId);
    if (!audio) throwNotFoundError('Audio not found');

    if (!audio.views.includes(reqBody.ipAddress)) {
      audio.views.push(reqBody.ipAddress);
      await audio.save();
    }
    
    return audio;
  }
 
  async getAudios(reqQuery) {
    console.log('Getting audio files');
    const validatorResponse = audioValidators.getAudiosValidator(reqQuery);
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const audios = await audioRepository.getAudioFiles(reqQuery);

    return audios;
  }

  async likeAudiobook({ audioId, ipAddress }) {
    console.log('Liking audio file with ID - ', audioId);
    const validatorResponse = chapterValidators.idValidator({ audioId }, 'audioId');
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const audio = await audioRepository.getAudio(audioId);
    if (!audio) throwNotFoundError('Audio not found');

    if (audio.likes.includes(ipAddress)) {
      audio.likes = audio.likes?.filter((like) => like !== ipAddress);
    } else {
      audio.likes.push(ipAddress);
    }
    await audio.save();

    return audio;
  }

  async rateAudio(reqBody) {
    console.log('Rate audio book with ID', reqBody?.audioId);
    const validatorResponse = chapterValidators.audioRatingValidator(
      { audioId: reqBody?.audioId, rating: reqBody?.rating },
    );
    if (validatorResponse.error) return throwBadRequestError(validatorResponse.error);

    const { audioId, rating, ipAddress } = reqBody;
    const audio = await audioRepository.getAudio(audioId);
    if (!audio) throwNotFoundError('Audio not found');

    const rate = audio.rating?.find((rate) => rate.ip === ipAddress);
    if (rate) {
      audio.rating = audio.rating?.filter((rate) => rate.ip !== ipAddress);
      
      // Update rating if it has changed
      if (rate.rating !== rating) {
        rate.rating = rating; 
        audio.rating.push(rate);
      } 
    } else {
      audio.rating.push({ ip: ipAddress, rating });
    }
    await audio.save();

    return audio;
  }
  
  async getCurrentUser(ipAddress) {
    console.log('Getting current user');

    return { ipAddress};
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
        await chapterRepository.deleteFile(chap?.publicId);
      }));
      await chapter.deleteOne();
    }

    await chapterRepository.deleteFile(audio.thumbnail, 'image');
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