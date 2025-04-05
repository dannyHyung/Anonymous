import axios from 'axios';
import { auth } from '../firebase/config';

let baseURL = process.env.REACT_APP_PRODUCTION_BASE_URL

if (window.location.hostname === 'localhost') {
  baseURL = process.env.REACT_APP_EMULATOR_BASE_URL;

}

const axiosInt = axios.create({
  baseURL: baseURL,
});

axiosInt.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInt;
