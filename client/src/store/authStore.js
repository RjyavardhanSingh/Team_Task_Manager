import { create } from 'zustand'

const getStoredUser = () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuthStore = create((set) => ({
    user: getStoredUser(),
    token: localStorage.getItem('token'),

    setAuth: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token);
        set({user, token})
    },

    logout: () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        set({user:null, token:null})
    }
}))
