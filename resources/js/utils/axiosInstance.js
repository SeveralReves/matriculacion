import axios from 'axios';
// Extrae el valor del token de la cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
// Deja que Laravel maneje el CSRF automáticamente con cookies
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const instance = axios.create({
  baseURL: '/',
  withCredentials: true, // muy importante para cookies
});

// Usa esto solo si tu sesión usa sanctum
export const fetchWithAuth = async (method, url, data = {}) => {
  await instance.get('/sanctum/csrf-cookie');
  const token = getCookie('XSRF-TOKEN');
  return instance({
    method,
    url,
    data,
    headers: {
      'X-XSRF-TOKEN': token,
    }
  });
};


export default instance;
