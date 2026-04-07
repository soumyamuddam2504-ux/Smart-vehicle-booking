import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api` });

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
