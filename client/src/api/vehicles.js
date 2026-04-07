import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api` });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getRecommendations = (params) =>
  API.get('/vehicles/recommend', { params });
