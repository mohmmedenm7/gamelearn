import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Admin Stats
export const getStats = () => api.get('/admin/stats');
export const getUsers = (params) => api.get('/admin/users', { params });
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Roadmaps
export const getAllRoadmaps = () => api.get('/roadmaps/all');
export const createRoadmap = (data) => api.post('/roadmaps', data);
export const updateRoadmap = (id, data) => api.put(`/roadmaps/${id}`, data);
export const deleteRoadmap = (id) => api.delete(`/roadmaps/${id}`);

// Steps
export const getSteps = (roadmapId) => api.get('/steps', { params: { roadmap: roadmapId } });
export const createStep = (data) => api.post('/steps', data);
export const updateStep = (id, data) => api.put(`/steps/${id}`, data);
export const deleteStep = (id) => api.delete(`/steps/${id}`);

// Resources
export const getResources = (stepId) => api.get('/resources', { params: { step: stepId } });
export const createResource = (data) => api.post('/resources', data);
export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

// Questions
export const getQuestions = (stepId) => api.get('/questions', { params: { step: stepId } });
export const createQuestion = (data) => api.post('/questions', data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

export default api;
