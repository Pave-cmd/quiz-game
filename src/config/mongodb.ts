import axios from 'axios';

// Základní konfigurace API
export const api = axios.create({
  baseURL: 'http://localhost:3001/api', // nebo vaše skutečná SERVER_URL
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor pro přidání tokenu
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
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getStoredToken = () => localStorage.getItem('token');

// Inicializace tokenu
const token = getStoredToken();
if (token) {
  setAuthToken(token);
}