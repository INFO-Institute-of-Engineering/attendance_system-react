import axios from 'axios';
import { connectToDatabase } from './mongodb';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual backend API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize MongoDB connection
const initMongoDB = async () => {
  try {
    // Comment out MongoDB connection for now to prevent errors
    // await connectToDatabase();
    console.log('MongoDB connection skipped for frontend-only mode');
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
  }
};

// Initialize MongoDB connection when the app starts
initMongoDB();

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;