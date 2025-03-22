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

  async getRecentAudios() {
    const RecentAudiosDuration = 7 * 24 * 60 * 60 * 1000;
    const audios = await AudioModel.find(
      {
        isPublic: true,
        createdAt: { $gte: new Date(new Date() - RecentAudiosDuration) },
      },
    ).limit(6);
    return audios;
  }
  
  async getAudioRecommendations(ipAddress) {
    const recommendedAudios = await AudioModel.aggregate([
      { $match: { isPublic: true, views: { $ne: ipAddress } } },
      { 
        $project: { 
          title: 1, 
          author: 1, 
          thumbnail: 1, 
          about: 1, 
          genre: 1, 
          viewsCount: { $size: '$views' },
          avgRating: { $avg: '$rating' },
          ratingCount: { $size: '$rating' },
        } 
      },
      { 
        $addFields: { 
          score: { 
            $sum: [
              '$viewsCount',                    // Raw views count
              { $multiply: ['$avgRating', 2] }  // Weight rating higher (adjustable)
            ] 
          } 
        } 
      },
      { $sort: { score: -1 } },
      // Limit to 10
      { $limit: 10 }
    ]);

    return recommendedAudios;
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

  async getTotalCounts(attribute) {
    const result = await Audio.aggregate([
      // Calculate views per document
      { $project: { valueCount: { $size: `$${attribute}` } } },
      // Sum all views
      { $group: { _id: null, totalCount: { $sum: '$valueCount' } } }
    ]);

    return result.length > 0 ? result[0].totalCount : 0;
  }
}
module.exports = new AudioRepository();
