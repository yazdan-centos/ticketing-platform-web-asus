import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8089';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach access token from sessionStorage
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – unwrap data, normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unknown network error';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
