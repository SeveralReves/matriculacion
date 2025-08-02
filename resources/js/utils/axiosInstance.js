// utils/axiosInstance.js
import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const instance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export const fetchWithAuth = async (method, url, data = {}) => {
  await instance.get('/sanctum/csrf-cookie'); // asegura que XSRF-TOKEN esté actualizado
  const token = getCookie('XSRF-TOKEN');

  return instance({
    method,
    url,
    data,
    headers: {
      'X-XSRF-TOKEN': token,
    },
  });
};

export default instance;
