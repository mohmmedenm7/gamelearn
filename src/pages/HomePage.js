import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaRocket } from 'react-icons/fa';
import { roadmaps } from '../data/roadmaps';
import './HomePage.css';

function HomePage() {
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

                                {/* Progress indicator */}
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

function getProgress(roadmapId, totalSteps) {
    try {
        const progress = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
        const completed = progress[roadmapId] ? Object.keys(progress[roadmapId]).length : 0;
        return Math.round((completed / totalSteps) * 100);
    } catch {
        return 0;
    }
}

export default HomePage;
