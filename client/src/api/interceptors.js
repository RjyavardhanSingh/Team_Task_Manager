import { axiosInstance } from './axiosInstance.js';
import { useAuthStore } from '../store/authStore.js';

export const setupInterceptors = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};
