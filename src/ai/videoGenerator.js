import axios from "axios";

export const generateVideo = async (topic) => {

  const url = "https://www.googleapis.com/youtube/v3/search";

  const response = await axios.get(url, {
    params: {
      part: "snippet",
      q: topic + " tutorial",
      key: process.env.YOUTUBE_API_KEY,
      maxResults: 5,
      type: "video"
    }
  });

  const video = response.data.items[0];

  return {
    title: video.snippet.title,
    description: video.snippet.description,
    videoId: video.id.videoId,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    thumbnail: video.snippet.thumbnails.medium.url
  };

};