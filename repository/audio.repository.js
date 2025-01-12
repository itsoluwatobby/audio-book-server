const { AudioModel } = require("../models");

class AudioRepository {
  async createAudio(newAudio) {
    return AudioModel.create(newAudio);
  }

  async getAudioFiles(query = {}) {
    const audios = await AudioModel.find(query);
    return audios;
  }

  async getAudio(audioId) {
    return AudioModel.findById(audioId);
  }

  async editAudio(audioId, updatedInfo) {
    return AudioModel.findOneAndUpdate(
      { id: audioId },
      updatedInfo,
      { new: true },
    )
  }

  async deleteAudio(audioId) {
    return AudioModel.deleteOne({ id: audioId });
  }
}
module.exports = new AudioRepository();
