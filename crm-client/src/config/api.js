// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://crm-g6ud-ankit-mishras-projects-f28e663c.vercel.app';

// Ensure the URL doesn't end with a slash to prevent double slashes
const cleanBaseURL = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

export default cleanBaseURL;
export { cleanBaseURL as API_BASE_URL };

// Axios instance with default configuration
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: cleanBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized - JWT token expired or invalid
      console.error('JWT Error: Authentication failed. Please log in again.');
      // You can redirect to login page here if needed
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden - user doesn't have permission
      console.error('JWT Error: Access forbidden. Insufficient permissions.');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('JWT Error: Resource not found. Please check the API endpoint.');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('JWT Error: Server error. Please try again later.');
    } else {
      // Handle other errors
      console.error('JWT Error:', error.message);
    }
    return Promise.reject(error);
  }
); 