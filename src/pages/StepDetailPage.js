import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaYoutube, FaBookOpen, FaExternalLinkAlt, FaClipboardCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { getRoadmapById, getStepById } from '../data/roadmaps';
import './StepDetailPage.css';

function StepDetailPage() {
    const { id, stepId } = useParams();
    const roadmap = getRoadmapById(id);
    const step = getStepById(id, stepId);

    if (!roadmap || !step) {
        return (
            <div className="not-found">
                <h2>لم يتم العثور على الخطوة</h2>
                <Link to="/">العودة للرئيسية</Link>
            </div>
        );
    }

    const stepIndex = roadmap.steps.findIndex(s => s.id === stepId);
    const prevStep = stepIndex > 0 ? roadmap.steps[stepIndex - 1] : null;
    const nextStep = stepIndex < roadmap.steps.length - 1 ? roadmap.steps[stepIndex + 1] : null;

    return (
        <div className="step-detail-page">
            <div className="step-detail-container">
                {/* Breadcrumb */}
                <motion.div
                    className="step-breadcrumb"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link to={`/roadmap/${id}`} className="breadcrumb-link">
                        {roadmap.icon} {roadmap.title}
                    </Link>
                    <span className="breadcrumb-separator">‹</span>
                    <span className="breadcrumb-current">الخطوة {step.order}</span>
                </motion.div>

                {/* Step Header */}
                <motion.div
                    className="step-detail-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div
                        className="step-detail-number"
                        style={{ background: roadmap.gradient }}
                    >
                        {step.order}
                    </div>
                    <h1 className="step-detail-title">{step.title}</h1>
                    <p className="step-detail-description">{step.description}</p>
                </motion.div>

                {/* Resources Section */}
                <motion.div
                    className="resources-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="resources-title">
                        <FaBookOpen className="resources-title-icon" />
                        الموارد التعليمية
                    </h2>

                    <div className="resources-list">
                        {step.resources.map((resource, index) => (
                            <motion.a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-card glass"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                id={`resource-${stepId}-${index}`}
                            >
                                <div className="resource-icon-wrap">
                                    {resource.type === 'video' ? (
                                        <FaYoutube className="resource-icon video-icon" />
                                    ) : (
                                        <FaBookOpen className="resource-icon article-icon" />
                                    )}
                                </div>

                                <div className="resource-info">
                                    <h3 className="resource-title">{resource.title}</h3>
                                    <div className="resource-meta">
                                        <span className="resource-type">
                                            {resource.type === 'video' ? '🎬 فيديو' : '📄 مقال'}
                                        </span>
                                        <span className="resource-platform">{resource.platform}</span>
                                    </div>
                                </div>

                                <FaExternalLinkAlt className="resource-external" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Quiz CTA */}
                <motion.div
                    className="quiz-cta glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="quiz-cta-content">
                        <FaClipboardCheck className="quiz-cta-icon" style={{ color: roadmap.color }} />
                        <div>
                            <h3 className="quiz-cta-title">هل أنت مستعد للاختبار؟</h3>
                            <p className="quiz-cta-desc">اختبر معلوماتك في هذه الخطوة لفتح الخطوة التالية</p>
                        </div>
                    </div>
                    <Link
                        to={`/roadmap/${id}/step/${stepId}/quiz`}
                        className="quiz-cta-btn"
                        style={{ background: roadmap.gradient }}
                        id={`start-quiz-${stepId}`}
                    >
                        ابدأ الاختبار
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                    </Link>
                </motion.div>

                {/* Navigation */}
                <motion.div
                    className="step-navigation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {prevStep ? (
                        <Link
                            to={`/roadmap/${id}/step/${prevStep.id}`}
                            className="step-nav-btn prev-btn glass"
                        >
                            <FaArrowRight />
                            <span>{prevStep.title}</span>
                        </Link>
                    ) : (
                        <div></div>
                    )}

                    {nextStep && (
                        <Link
                            to={`/roadmap/${id}/step/${nextStep.id}`}
                            className="step-nav-btn next-btn glass"
                        >
                            <span>{nextStep.title}</span>
                            <FaArrowLeft />
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default StepDetailPage;
