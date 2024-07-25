import axios from 'axios';

const axiosInt = axios.create({
    baseURL: 'http://localhost:5000', // Base URL for all API requests
  });

export default axiosInt;
