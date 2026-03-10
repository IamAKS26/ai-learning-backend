import axios from "axios";

export const generateVideo = async (topic) => {

  const url = "https://www.googleapis.com/youtube/v3/search";

  const response = await axios.get(url, {
    params: {
      part: "snippet",
      q: topic + " programming tutorial",
      key: process.env.YOUTUBE_API_KEY,
      maxResults: 10,
      type: "video",
      videoEmbeddable: "true"
    }
  });

  const videos = response.data.items;

  if (!videos || videos.length === 0) {
    throw new Error("No video found");
  }

  // Filter useful educational videos
  const filteredVideos = videos.filter(video => {

    const title = video.snippet.title.toLowerCase();

    return (
      !title.includes("short") &&
      !title.includes("shorts") &&
      !title.includes("live") &&
      !title.includes("stream")
    );

  });
  const trustedChannels = [
  "Programming with Mosh",
  "freeCodeCamp",
  "Traversy Media",
  "Net Ninja",
  "Academind",
  "Fireship"
];

  
  let bestVideo = filteredVideos[0] || videos[0];

for (const video of filteredVideos) {

  if (trustedChannels.includes(video.snippet.channelTitle)) {
    bestVideo = video;
    break;
  }

}

  return {
    title: bestVideo.snippet.title,
    description: bestVideo.snippet.description,
    videoId: bestVideo.id.videoId,
    url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
    thumbnail: bestVideo.snippet.thumbnails.medium.url,
    channelTitle: bestVideo.snippet.channelTitle
  };


};