const fs = require('fs');
const audioRepository = require('../repository/audio.repository');
// import path from 'path';

class AudioServices {

  async uploadFile(req, res) {
    try {

      console.log('File successfully uploaded');
      const filename = req.files.audio ? req.files.audio[0].filename : req.files.thumbnail[0].filename;
  
      res.status(201).json(
        {
          statusCode: 201,
          message: 'File successfully uploaded',
          path: filename,
        }
      );
    } catch (error) {
      console.log('error uploading file ', error.massage)
      res.status(406).json({ statusCode: 406, message: error.message });
    }
  }
  
  async createAudio(req, res) {
    try {
      console.log('Creating audio file');

      const audio = await audioRepository.getAudio(req.body);
      if (!audio) return res.status(404).json(
        { statusCode: 400, message: 'Error creating audio' },
      );
  
      res.status(201).json(
        {
          statusCode: 201,
          message: 'File successfully created',
          audio,
        }
      );
    } catch (error) {
      console.log('error uploading file ', error.massage);
      res.status(406).json({ statusCode: 406, message: error.message });
    }
  }

  async getAudioFile(req, res) {
    try {
      console.log('Getting audio file');
      const audioId = req.params.audioId;
  
      const audio = await audioRepository.getAudio(audioId);
      if (!audio) return res.status(404).json(
        {
          statusCode: 404,
          message: 'Audio not found',
        }
      );
  
      res.status(200).json(
        {
          statusCode: 200,
          message: 'File successfully retrieved',
          audio,
        }
      );
    } catch (error) {
      console.log('error retrieving file ', error.massage);
      res.status(406).json({ statusCode: 406, message: error.message });
    }
  }
 
  async getAudios(req, res) {
    try {
      console.log('Getting audio files');
  
      const audios = await audioRepository.getAudioFiles({});
  
      res.status(200).json(
        {
          statusCode: 200,
          message: 'File successfully uploaded',
          data: audios,
        }
      );
    } catch (error) {
      console.log('error retrieving file ', error.massage);
      res.status(406).json({ statusCode: 406, message: error.message });
    }
  }

  async streamAudio(req, res) {
    const fileName = req.params.fileName;
    console.log(`Stream Audio with audioId ${fileName}`);
    try {
      const path = 'uploads/' + fileName;
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
      console.log(error.message);
      res.status(406).json({ statusCode: 406, message: error.message });
    }
  }
}
module.exports = new AudioServices();