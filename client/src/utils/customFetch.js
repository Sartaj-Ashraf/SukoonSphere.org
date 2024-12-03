import axios from "axios";

const customFetch = axios.create({ 
  baseURL: "/api/v1",
  withCredentials: true 
});

// Response interceptor
customFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await customFetch.get('/auth/refresh-token');
        
        // Retry the original request
        return customFetch(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default customFetch;