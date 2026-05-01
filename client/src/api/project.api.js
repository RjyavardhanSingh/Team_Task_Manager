import { axiosInstance } from './axiosInstance';

export const projectApi = {
    getProjects: async () => {
        const response = await axiosInstance.get('/projects');
        return response.data;
    },
    createProject: async (payload) => {
        const response = await axiosInstance.post('/projects', payload);
        return response.data;
    },
};
