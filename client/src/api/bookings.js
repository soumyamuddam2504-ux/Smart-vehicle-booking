import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = () => API.get('/bookings');
