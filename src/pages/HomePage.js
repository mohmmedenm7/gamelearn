import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaRocket, FaUsers, FaGlobe } from 'react-icons/fa';
import { roadmaps } from '../data/roadmaps';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/api';
import './HomePage.css';

function HomePage({ onLoginClick }) {
    const isLoggedIn = !!localStorage.getItem('token');
    const { user } = useAuth();
    const [backendProgress, setBackendProgress] = useState(null);

    useEffect(() => {
        const loadProgress = async () => {
            if (user) {
                try {
                    const response = await progressService.get();
                    setBackendProgress(response.data || {});
                } catch (err) {
                    console.error('Error loading progress:', err);
                }
            }
        };
        loadProgress();
    }, [user]);

    const getProgress = (roadmapId, totalSteps) => {
        try {
            // Use backend progress if available
            if (backendProgress && backendProgress[roadmapId]) {
                const completed = Object.keys(backendProgress[roadmapId]).length;
                return Math.round((completed / totalSteps) * 100);
            }
            // Fallback to localStorage
            const progress = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
            const completed = progress[roadmapId] ? Object.keys(progress[roadmapId]).length : 0;
            return Math.round((completed / totalSteps) * 100);
        } catch {
            return 0;
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="hero-badge">
                        <FaRocket className="hero-badge-icon" />
                        <span>ابدأ رحلة التعلم الآن</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="gradient-text">خارطة طريق</span>
                        <br />
                        <span>التعلم التفاعلي</span>
                    </h1>

                    <p className="hero-description">
                        اختر المجال الذي تريد تعلمه واتبع خارطة الطريق خطوة بخطوة.
                        <br />
                        موارد تعليمية مختارة واختبارات لكل مرحلة.
                    </p>

                    {!isLoggedIn && (
                        <div className="hero-cta-actions">
                            <button className="btn-hero-primary" onClick={onLoginClick}>
                                ابدأ رحلتك مجاناً
                            </button>
                        </div>
                    )}

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">{roadmaps.length}</span>
                            <span className="hero-stat-label">مجال تعليمي</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">
                                {roadmaps.reduce((acc, r) => acc + r.steps.length, 0)}
                            </span>
                            <span className="hero-stat-label">خطوة تعليمية</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">
                                {roadmaps.reduce((acc, r) => acc + r.steps.reduce((a, s) => a + s.quiz.length, 0), 0)}
                            </span>
                            <span className="hero-stat-label">سؤال اختبار</span>
                        </div>
                    </div>
                </motion.div>

                {/* Floating decorations */}
                <div className="hero-decoration hero-decoration-1"></div>
                <div className="hero-decoration hero-decoration-2"></div>
                <div className="hero-decoration hero-decoration-3"></div>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links-section">
                <Link to="/leaderboard" className="quick-link-card glass border-yellow">
                    <FaGlobe className="ql-icon text-yellow" />
                    <div>
                        <h3>تصنيف الأبطال</h3>
                        <p>شاهد ترتيبك العالمي بين اللاعبين</p>
                    </div>
                </Link>
                <Link to="/groups" className="quick-link-card glass border-purple">
                    <FaUsers className="ql-icon text-purple" />
                    <div>
                        <h3>مجموعات التحدي</h3>
                        <p>تعلم مع أصدقائك وتنافسوا معاً</p>
                    </div>
                </Link>
            </section>

            {/* Roadmaps Section */}
            <section className="roadmaps-section">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <FaStar className="section-title-icon" />
                    اختر مجال التعلم
                </motion.h2>

                <div className="roadmaps-grid">
                    {roadmaps.map((roadmap, index) => (
                        <motion.div
                            key={roadmap.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                        >
                            <Link
                                to={`/roadmap/${roadmap.id}`}
                                className="roadmap-card glass"
                                style={{ '--card-color': roadmap.color, '--card-secondary': roadmap.colorSecondary }}
                                id={`roadmap-card-${roadmap.id}`}
                            >
                                <div className="roadmap-card-glow"></div>
                                <div className="roadmap-card-icon">{roadmap.icon}</div>
                                <h3 className="roadmap-card-title">{roadmap.title}</h3>
                                <p className="roadmap-card-title-en">{roadmap.titleEn}</p>
                                <p className="roadmap-card-description">{roadmap.description}</p>

                                <div className="roadmap-card-meta">
                                    <span className="roadmap-card-steps">
                                        {roadmap.steps.length} خطوات
                                    </span>
                                    <span className="roadmap-card-arrow">
                                        <FaArrowLeft />
                                    </span>
                                </div>

                                <div className="roadmap-card-progress">
                                    <div className="roadmap-card-progress-bar">
                                        <div
                                            className="roadmap-card-progress-fill"
                                            style={{ width: `${getProgress(roadmap.id, roadmap.steps.length)}%` }}
                                        ></div>
                                    </div>
                                    <span className="roadmap-card-progress-text">
                                        {getProgress(roadmap.id, roadmap.steps.length)}% مكتمل
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HomePage;
