import Bottleneck from "bottleneck";

export const videoLimiter = new Bottleneck({
  maxConcurrent: 4, // allow 4 video requests at once
  minTime: 800      // 800ms gap between requests
});