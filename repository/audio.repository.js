const { AudioModel } = require("../models");

const initQuery = {
  isPublic: true,
  limit: 10,
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

  async getAudioRecommendations() {
    const RecentAudiosDuration = 7 * 24 * 60 * 60 * 1000;
    const audios = await AudioModel.find(
      {
        isPublic: true,
        createdAt: { $gte: new Date(new Date() - RecentAudiosDuration) },
      },
    ).limit(6);
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
