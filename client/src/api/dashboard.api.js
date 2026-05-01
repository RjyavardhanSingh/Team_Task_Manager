import { axiosInstance } from './axiosInstance';

export const dashboardApi = {
    getMetrics: async () => {
        const response = await axiosInstance.get('/dashboard');
        return response.data;
    },
};
