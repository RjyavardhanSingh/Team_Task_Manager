import axios from 'axios';

// Vite uses import.meta.env for environment variables
const API_URL = (import.meta.env.VITE_API_URL || '').trim();

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
});
