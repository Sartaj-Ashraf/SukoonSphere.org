import customFetch from "@/utils/customFetch";

// Video Management Routes:
// POST "/create-video" - Create new video (with cover image upload)
// PATCH "/update-video/:id" - Update video (with cover image upload)
// DELETE "/delete-video/:id" - Delete video
// GET "/video/:id" - Get single video by ID

// Video Listing Routes:
// GET "/user-videos" - Get user's videos
// GET "/all-videos" - Get all videos
// GET "/single-videos" - Get single videos
// GET "/playlist-videos" - Get playlist videos

const API_URL = '/videos';

export const videoServices = {
  // Video management
  createVideo: async (videoData) => {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
      formData.append(key, videoData[key]);
    });
    const { data } = await customFetch.post(`${API_URL}/create-video`, formData);
    return data;
  },

  getUserVideos: async () => {
    const { data } = await customFetch.get(`${API_URL}/user-videos`);
    return data;
  },

  getSingleVideo: async (videoId) => {
    const { data } = await customFetch.get(`${API_URL}/video/${videoId}`);
    return data;
  },

  updateVideo: async (videoId, videoData) => {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
      formData.append(key, videoData[key]);
    });
    const { data } = await customFetch.patch(`${API_URL}/update-video/${videoId}`, formData);
    return data;
  },

  deleteVideo: async (videoId) => {
    const { data } = await customFetch.delete(`${API_URL}/delete-video/${videoId}`);
    return data;
  },

  // Video listings
  getAllVideos: async () => {
    const { data } = await customFetch.get(`${API_URL}/all-videos`);
    return data;
  },

  getSingleVideos: async () => {
    const { data } = await customFetch.get(`${API_URL}/single-videos`);
    return data;
  },

  getPlaylistVideos: async () => {
    const { data } = await customFetch.get(`${API_URL}/playlist-videos`);
    return data;
  }
};
