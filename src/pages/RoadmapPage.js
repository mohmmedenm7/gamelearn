import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaLock } from 'react-icons/fa';
import { getRoadmapById } from '../data/roadmaps';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/api';
import './RoadmapPage.css';

/* ============================================
   GAME CHARACTER - Animated Astronaut
   ============================================ */
function GameCharacter() {
    return (
        <div className="game-character">
            <div className="character-body">
                <div className="character-helmet">
                    <div className="character-visor">
                        <div className="character-visor-shine" />
                        <div className="character-eyes">
                            <div className="character-eye" />
                            <div className="character-eye" />
                        </div>
                    </div>
                </div>
                <div className="character-suit" />
                <div className="character-jetpack" />
                <div className="character-flame" />
            </div>
            <div className="character-glow" />
        </div>
    );
}

/* ============================================
   GAME NODE - Step circle on the path
   ============================================ */
function GameNode({ step, index, completed, isCurrent, unlocked, roadmap, id }) {
    const nodeContent = completed ? (
        <FaCheckCircle className="node-check" />
    ) : !unlocked ? (
        <FaLock />
    ) : (
        <span>{step.order}</span>
    );

    const stateClass = completed ? 'completed' : isCurrent ? 'current' : 'locked';

    const inner = (
        <motion.div
            className={`game-node-wrapper ${!unlocked ? 'locked' : ''}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
        >
            {isCurrent && <GameCharacter />}
            <div
                className={`game-node ${stateClass}`}
                style={{ '--step-color': roadmap.color }}
            >
                {nodeContent}
            </div>
            <div className="game-node-label">
                <div className="game-node-order">الخطوة {step.order}</div>
                <div className="game-node-title">{step.title}</div>
            </div>
        </motion.div>
    );

    if (unlocked) {
        return (
            <Link
                to={`/roadmap/${id}/step/${step.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                id={`step-node-${step.id}`}
            >
                {inner}
            </Link>
        );
    }

    return inner;
}

/* ============================================
   ROADMAP PAGE - Main Game Path
   ============================================ */
function RoadmapPage() {
    const { id } = useParams();
    const roadmap = getRoadmapById(id);
    const { user } = useAuth();
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const loadProgress = async () => {
            // Try backend first if logged in
            if (user) {
                try {
                    const response = await progressService.get();
                    const backendProgress = response.data || {};
                    if (backendProgress[id]) {
                        setProgress(backendProgress[id]);
                        return;
                    }
                } catch (err) {
                    console.error('Error loading backend progress:', err);
                }
            }

            // Fallback to localStorage
            try {
                const stored = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
                setProgress(stored[id] || {});
            } catch {
                setProgress({});
            }
        };

        loadProgress();
    }, [id, user]);

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

    const buildPathRows = () => {
        const rows = [];
        const stepsPerRow = 3;
        for (let i = 0; i < roadmap.steps.length; i += stepsPerRow) {
            const rowSteps = roadmap.steps.slice(i, i + stepsPerRow);
            const rowIndex = Math.floor(i / stepsPerRow);
            if (rowIndex % 2 === 1) {
                rowSteps.reverse();
            }
            rows.push({ steps: rowSteps, reversed: rowIndex % 2 === 1, startIndex: i });
        }
        return rows;
    };

    const pathRows = buildPathRows();

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

            {/* Game Path */}
            <div className="game-path-container">
                <div className="game-decorations">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="game-star" />
                    ))}
                </div>

                {pathRows.map((row, rowIndex) => {
                    const isLastRow = rowIndex === pathRows.length - 1;
                    const lastStepGlobalIdx = row.startIndex + row.steps.length - 1;
                    const lastStepCompleted = progress[roadmap.steps[lastStepGlobalIdx]?.id] === true;
                    const connectorSide = row.reversed ? 'connector-left' : 'connector-right';

                    return (
                        <React.Fragment key={rowIndex}>
                            <div className="game-path-row">
                                {row.steps.map((step, stepInRow) => {
                                    let globalIndex;
                                    if (row.reversed) {
                                        globalIndex = row.startIndex + (row.steps.length - 1 - stepInRow);
                                    } else {
                                        globalIndex = row.startIndex + stepInRow;
                                    }

                                    const unlocked = isStepUnlocked(globalIndex);
                                    const completed = progress[step.id] === true;
                                    const isCurrent = unlocked && !completed;
                                    const showHorizConnector = stepInRow < row.steps.length - 1;

                                    let horizCompleted = false;
                                    if (showHorizConnector) {
                                        let nextGlobalIndex;
                                        if (row.reversed) {
                                            nextGlobalIndex = row.startIndex + (row.steps.length - 1 - (stepInRow + 1));
                                        } else {
                                            nextGlobalIndex = row.startIndex + stepInRow + 1;
                                        }
                                        const minIdx = Math.min(globalIndex, nextGlobalIndex);
                                        horizCompleted = progress[roadmap.steps[minIdx]?.id] === true;
                                    }

                                    return (
                                        <React.Fragment key={step.id}>
                                            <GameNode
                                                step={step}
                                                index={globalIndex}
                                                completed={completed}
                                                isCurrent={isCurrent}
                                                unlocked={unlocked}
                                                roadmap={roadmap}
                                                id={id}
                                            />
                                            {showHorizConnector && (
                                                <div
                                                    className={`game-node-connector ${horizCompleted ? 'completed' : 'incomplete'}`}
                                                    style={{ '--step-color': roadmap.color }}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {!isLastRow && (
                                <div className={`game-row-connector ${connectorSide}`}>
                                    <div
                                        className={`connector-line ${lastStepCompleted ? 'completed' : 'incomplete'}`}
                                        style={{ '--step-color': roadmap.color }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                <motion.div
                    className="game-finish-line"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="finish-flag">
                        <span className="finish-flag-icon">🏆</span>
                        <span className="finish-flag-text">
                            {progressPercent === 100 ? 'أحسنت! أكملت المسار! 🎉' : 'خط النهاية'}
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default RoadmapPage;
