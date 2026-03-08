import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const userService = {
    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    updateAvatar: async (avatarData) => {
        const response = await api.put('/users/avatar', avatarData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    getLeaderboard: async () => {
        const response = await api.get('/users/leaderboard');
        return response.data;
    },
};

export const roadmapService = {
    getAll: async () => {
        const response = await api.get('/roadmaps');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/roadmaps/${id}`);
        return response.data;
    }
};

export const groupService = {
    create: async (data) => {
        const response = await api.post('/groups', data);
        return response.data;
    },

    joinByCode: async (inviteCode) => {
        const response = await api.post('/groups/join/code', { inviteCode });
        return response.data;
    },

    joinByUsername: async (username, groupId) => {
        const response = await api.post('/groups/join/username', { username, groupId });
        return response.data;
    },

    getMyGroups: async () => {
        const response = await api.get('/groups/my');
        return response.data;
    },

    search: async (q) => {
        const response = await api.get(`/groups/search?q=${q}`);
        return response.data;
    },

    getDetails: async (id) => {
        const response = await api.get(`/groups/${id}`);
        return response.data;
    }
};

export default api;
