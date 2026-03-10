import Bottleneck from "bottleneck";

export const aiLimiter = new Bottleneck({
  maxConcurrent: 2, // only 2 AI calls at same time
  minTime: 500      // 500ms between requests
});