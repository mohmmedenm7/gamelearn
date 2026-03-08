import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Attempt to fetch fresh user data
                    const response = await authService.getCurrentUser();
                    setUser(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            } catch (error) {
                console.error('Auth init error:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        setUser(response.user);
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateContextUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateContextUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
