import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaAt, FaGamepad, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/profile');
                if (onClose) onClose();
            } else {
                await register(formData);
                navigate('/profile');
                if (onClose) onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen && typeof isOpen !== 'undefined') return null;

    const content = (
        <motion.div
            className="auth-container glass"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            {onClose && (
                <button className="auth-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
            )}

            <div className="auth-header">
                <FaGamepad className="auth-logo" />
                <h2>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
                <p>{isLogin ? 'مرحباً بعودتك يا بطل!' : 'ابدأ رحلتك التعليمية الممتعة الآن'}</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                    <>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                placeholder="الاسم الكامل"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <FaAt className="input-icon" />
                            <input
                                type="text"
                                name="username"
                                placeholder="اسم المستخدم (بالإنجليزي بدون مسافات)"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="البريد الإلكتروني"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        name="password"
                        placeholder="كلمة المرور"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'الرجاء الانتظار...' : (isLogin ? 'دخول' : 'تسجيل')}
                </button>
            </form>

            <div className="auth-footer">
                <p>
                    {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                    <span
                        className="auth-switch-link"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'سجل الآن' : 'سجل الدخول'}
                    </span>
                </p>
            </div>
        </motion.div>
    );

    // If used as a modal
    if (typeof isOpen !== 'undefined') {
        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
                        {content}
                    </div>
                )}
            </AnimatePresence>
        );
    }

    // If used as a standalone page
    return (
        <div className="auth-page-wrapper">
            {content}
        </div>
    );
}

export default LoginPage;
