import axios from 'axios';

const normalizeApiUrl = (rawUrl) => {
    const value = (rawUrl || '').trim().replace(/\/+$/, '');
    if (!value) return '';

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value)) {
        return `http://${value}`;
    }

    return `https://${value}`;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const axiosInstance = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : '/api',
    timeout: 10000,
});
