import axios from 'axios';

// ✅ Use environment variable (Vite)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // important for cookies / auth
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Global error handling (optional but powerful)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle unauthorized
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");
      // optional: redirect logic
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;