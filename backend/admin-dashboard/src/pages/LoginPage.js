import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRoute, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';

function LoginPage() {
    const { login, loading, error, setError } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(form.email, form.password);
    };

    return (
        <div className="login-page">
            <div className="login-decoration login-dec-1"></div>
            <div className="login-decoration login-dec-2"></div>

            <div className="login-card glass animate-in">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <FaRoute />
                    </div>
                    <div>
                        <h1 className="login-title">خارطة التعلم</h1>
                        <p className="login-subtitle">لوحة تحكم المدير</p>
                    </div>
                </div>

                <div className="login-divider"></div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="alert alert-danger" onClick={() => setError(null)}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">البريد الإلكتروني</label>
                        <div className="input-icon-wrap">
                            <FaUser className="input-icon" />
                            <input
                                type="email"
                                className="form-control with-icon"
                                placeholder="admin@roadmap.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                id="login-email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">كلمة المرور</label>
                        <div className="input-icon-wrap">
                            <FaLock className="input-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="form-control with-icon with-icon-end"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                id="login-password"
                            />
                            <button
                                type="button"
                                className="icon-toggle-btn"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                        id="login-submit"
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            '🔐 تسجيل الدخول'
                        )}
                    </button>
                </form>

                <p className="login-note">
                    هذه اللوحة مخصصة للمدراء فقط
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
