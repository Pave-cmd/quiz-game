import axios from 'axios';

const getBaseUrl = () => {
  if (window.location.hostname.includes('github.dev')) {
    // Pro GitHub Codespaces - tvoří URL s portem 3001 (server port)
    const hostname = window.location.hostname.replace(/-(5180|3000)\./, '-3001.');
    return `https://${hostname}/api`;  // Přidáno /api pro správné směrování
  }
  // Lokální vývoj - využije Vite proxy
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor pro přidání tokenu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quiz_auth_token'); // Opraveno pro použití správného klíče
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request to:', config.url, 'with baseURL:', config.baseURL);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pro logování a handling chyb
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('quiz_auth_token'); // Opraveno pro použití správného klíče
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('quiz_auth_token', token); // Opraveno pro použití správného klíče
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('quiz_auth_token'); // Opraveno pro použití správného klíče
    delete api.defaults.headers.common['Authorization'];
  }
};