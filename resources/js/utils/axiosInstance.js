import axios from 'axios';

// Deja que Laravel maneje el CSRF automáticamente con cookies
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const instance = axios.create({
  baseURL: '/',
  withCredentials: true, // muy importante para cookies
});

// Usa esto solo si tu sesión usa sanctum
export const fetchWithAuth = async (method, url, data = {}) => {
  await instance.get('/sanctum/csrf-cookie'); // genera la cookie XSRF-TOKEN
  return instance({ method, url, data });
};

export default instance;
