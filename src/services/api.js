import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.99:71/GLOBAL/Controller/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
