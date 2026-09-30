import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor: agregar el token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pequemundo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejar errores globales (401 = sesión expirada)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pequemundo_token');
      localStorage.removeItem('pequemundo_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;