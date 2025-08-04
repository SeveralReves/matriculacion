// utils/axiosInstance.js
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export const fetchWithAuth = async (method, url, data = {}) => {
  await axios.get('/sanctum/csrf-cookie');
  return axios({ method, url, data });
};
