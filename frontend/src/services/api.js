import axios from 'axios';

// Change this to your deployed backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/upload', formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Upload failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check if backend is running.');
    } else {
      throw new Error('Error uploading file: ' + error.message);
    }
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not reachable');
  }
};

export default api;