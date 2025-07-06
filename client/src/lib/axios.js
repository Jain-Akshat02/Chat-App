import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? "https://chat-app-uf4o.onrender.com/"
        : 'http://localhost:5000',
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json'
  }
});
