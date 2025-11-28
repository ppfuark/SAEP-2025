// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    axios.post(`${API_URL}/token/`, { username, password }),
  
  refresh: (refresh) => 
    axios.post(`${API_URL}/token/refresh/`, { refresh }),
};

export const produtosAPI = {
  getAll: (search = '') => api.get(`/produtos/${search ? `?search=${search}` : ''}`),
  create: (data) => api.post('/produtos/', data),
  update: (id, data) => api.put(`/produtos/${id}/`, data),
  delete: (id) => api.delete(`/produtos/${id}/`),
};

export const movimentacoesAPI = {
  getAll: () => api.get('/movimentacoes/'),
  create: (data) => api.post('/movimentacoes/', data),
};

export const estoqueAPI = {
  getBaixo: () => api.get('/estoque-baixo/'),
};

export default api;