import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi({ email, password });
            const { token, user: userData } = res.data;

            if (userData.role !== 'admin') {
                throw new Error('ليس لديك صلاحيات الوصول للوحة التحكم');
            }

            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'فشل تسجيل الدخول';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, setError, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
