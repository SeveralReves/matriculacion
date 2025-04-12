import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export const fetchWithAuth = async (method, url, data = {}) => {
  await instance.get('/sanctum/csrf-cookie');
  return instance({ method, url, data });
};

export default instance;
