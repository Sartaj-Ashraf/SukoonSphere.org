import axios from "axios";
import { toast } from "react-toastify";

const customFetch = axios.create({ 
  baseURL: "/api/v1",
  withCredentials: true 
});

// Response interceptor
customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data from localStorage on authentication error
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      toast.error('Session expired. Please sign in again.');
      // Force reload the page to reset app state
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default customFetch;
