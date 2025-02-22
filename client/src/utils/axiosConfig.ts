import axios from 'axios';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
