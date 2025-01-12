const { AudioModel } = require("../models");

const initQuery = {
  isPublic: true,
  limit: 45,
  page: 1,
};

class AudioRepository {
  async createAudio(newAudio) {
    return AudioModel.create(newAudio);
  }

  async getAudioFiles(query = initQuery) {
    const { page, limit, ...rest } = query;
    const audios = await AudioModel.paginate(
      rest,
      { page, limit },
    );
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
