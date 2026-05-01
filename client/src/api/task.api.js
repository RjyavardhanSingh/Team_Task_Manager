import { axiosInstance } from './axiosInstance';

export const taskApi = {
    getProjectTasks: async (projectId) => {
        const response = await axiosInstance.get(`/task/${projectId}`);
        return response.data;
    },
    createTask: async (payload) => {
        const response = await axiosInstance.post('/task', payload);
        return response.data;
    },
    updateStatus: async (taskId, status) => {
        const response = await axiosInstance.patch(`/task/${taskId}/status`, { status });
        return response.data;
    },
};
