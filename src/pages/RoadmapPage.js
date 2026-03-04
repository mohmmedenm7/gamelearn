import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaLock, FaPlay, FaArrowLeft } from 'react-icons/fa';
import { getRoadmapById } from '../data/roadmaps';
import './RoadmapPage.css';

function RoadmapPage() {
    const { id } = useParams();
    const roadmap = getRoadmapById(id);
    const [progress, setProgress] = useState({});

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
            setProgress(stored[id] || {});
        } catch {
            setProgress({});
        }
    }, [id]);

    if (!roadmap) {
        return (
            <div className="not-found">
                <h2>لم يتم العثور على خارطة الطريق</h2>
                <Link to="/">العودة للرئيسية</Link>
            </div>
        );
    }

    const completedCount = Object.keys(progress).length;
    const totalSteps = roadmap.steps.length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    const isStepUnlocked = (stepIndex) => {
        if (stepIndex === 0) return true;
        const prevStep = roadmap.steps[stepIndex - 1];
        return progress[prevStep.id] === true;
    };

    return (
        <div className="roadmap-page">
            {/* Header */}
            <motion.div
                className="roadmap-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="roadmap-header-content">
                    <div className="roadmap-header-icon">{roadmap.icon}</div>
                    <div>
                        <h1 className="roadmap-header-title" style={{ color: roadmap.color }}>
                            {roadmap.title}
                        </h1>
                        <p className="roadmap-header-subtitle">{roadmap.description}</p>
                    </div>
                </div>

                <div className="roadmap-progress-overview">
                    <div className="roadmap-progress-info">
                        <span className="roadmap-progress-label">التقدم الكلي</span>
                        <span className="roadmap-progress-percent" style={{ color: roadmap.color }}>
                            {progressPercent}%
                        </span>
                    </div>
                    <div className="roadmap-progress-bar-outer">
                        <motion.div
                            className="roadmap-progress-bar-inner"
                            style={{ background: roadmap.gradient }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                    <span className="roadmap-progress-detail">
                        {completedCount} من {totalSteps} خطوات مكتملة
                    </span>
                </div>
            </motion.div>

            {/* Roadmap Steps */}
            <div className="roadmap-steps-container">
                <div className="roadmap-timeline">
                    {roadmap.steps.map((step, index) => {
                        const unlocked = isStepUnlocked(index);
                        const completed = progress[step.id] === true;
                        const isCurrent = unlocked && !completed;

                        return (
                            <motion.div
                                key={step.id}
                                className={`roadmap-step ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!unlocked ? 'locked' : ''}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            >
                                {/* Timeline connector */}
                                {index < roadmap.steps.length - 1 && (
                                    <div className="step-connector">
                                        <div
                                            className="step-connector-fill"
                                            style={{
                                                background: completed ? roadmap.gradient : 'rgba(255,255,255,0.08)',
                                                height: '100%'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Step node */}
                                <div
                                    className="step-node"
                                    style={{
                                        borderColor: completed ? roadmap.color : isCurrent ? roadmap.color : 'rgba(255,255,255,0.15)',
                                        background: completed ? roadmap.color : 'var(--bg-secondary)',
                                        boxShadow: isCurrent ? `0 0 20px ${roadmap.color}40` : 'none'
                                    }}
                                >
                                    {completed ? (
                                        <FaCheckCircle />
                                    ) : !unlocked ? (
                                        <FaLock />
                                    ) : (
                                        <span className="step-node-number">{step.order}</span>
                                    )}
                                </div>

                                {/* Step card */}
                                {unlocked ? (
                                    <Link
                                        to={`/roadmap/${id}/step/${step.id}`}
                                        className="step-card glass"
                                        id={`step-card-${step.id}`}
                                        style={{ '--step-color': roadmap.color }}
                                    >
                                        <div className="step-card-header">
                                            <span className="step-card-order" style={{ background: roadmap.gradient }}>
                                                الخطوة {step.order}
                                            </span>
                                            {completed && (
                                                <span className="step-card-badge completed-badge">مكتملة ✓</span>
                                            )}
                                            {isCurrent && (
                                                <span className="step-card-badge current-badge" style={{ borderColor: roadmap.color, color: roadmap.color }}>
                                                    الحالية
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="step-card-title">{step.title}</h3>
                                        <p className="step-card-description">{step.description}</p>
                                        <div className="step-card-footer">
                                            <span className="step-card-resources">
                                                {step.resources.length} موارد تعليمية
                                            </span>
                                            <span className="step-card-action" style={{ color: roadmap.color }}>
                                                {completed ? 'مراجعة' : 'ابدأ التعلم'}
                                                <FaArrowLeft style={{ marginRight: '6px' }} />
                                            </span>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="step-card glass locked-card">
                                        <div className="step-card-header">
                                            <span className="step-card-order locked-order">الخطوة {step.order}</span>
                                            <span className="step-card-badge locked-badge">
                                                <FaLock style={{ marginLeft: '4px' }} /> مقفلة
                                            </span>
                                        </div>
                                        <h3 className="step-card-title locked-title">{step.title}</h3>
                                        <p className="step-card-description locked-desc">
                                            أكمل الخطوة السابقة لفتح هذه الخطوة
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RoadmapPage;
