import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRedo, FaArrowLeft, FaStar } from 'react-icons/fa';
import { getRoadmapById, getStepById } from '../data/roadmaps';
import './QuizPage.css';

function QuizPage() {
    const { id, stepId } = useParams();

    const roadmap = getRoadmapById(id);
    const step = getStepById(id, stepId);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answers, setAnswers] = useState([]);

    if (!roadmap || !step) {
        return (
            <div className="not-found">
                <h2>لم يتم العثور على الاختبار</h2>
                <Link to="/">العودة للرئيسية</Link>
            </div>
        );
    }

    const quiz = step.quiz;
    const totalQuestions = quiz.length;
    const passingScore = Math.ceil(totalQuestions * 0.6);


    const handleAnswer = (optionIndex) => {
        if (isAnswered) return;

        setSelectedAnswer(optionIndex);
        setIsAnswered(true);

        const isCorrect = optionIndex === quiz[currentQuestion].correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setAnswers(prev => [...prev, {
            question: currentQuestion,
            selected: optionIndex,
            correct: quiz[currentQuestion].correct,
            isCorrect
        }]);
    };

    const handleNext = () => {
        if (currentQuestion + 1 < totalQuestions) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            if (score + (selectedAnswer === quiz[currentQuestion]?.correct ? 1 : 0) >= passingScore) {
                saveProgress();
            }
        }
    };

    const saveProgress = () => {
        try {
            const stored = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
            if (!stored[id]) stored[id] = {};
            stored[id][stepId] = true;
            localStorage.setItem('roadmap-progress', JSON.stringify(stored));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
        setAnswers([]);
    };

    // Show results
    if (showResults) {
        const finalScore = answers.filter(a => a.isCorrect).length;
        const finalPassed = finalScore >= passingScore;

        return (
            <div className="quiz-page">
                <div className="quiz-container">
                    <motion.div
                        className="quiz-results glass"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={`results-icon ${finalPassed ? 'passed' : 'failed'}`}>
                            {finalPassed ? <FaTrophy /> : <FaTimesCircle />}
                        </div>

                        <h2 className="results-title">
                            {finalPassed ? '🎉 أحسنت! لقد اجتزت الاختبار' : '😔 لم تجتز الاختبار'}
                        </h2>

                        <div className="results-score">
                            <div className="results-score-circle" style={{
                                background: finalPassed ? roadmap.gradient : 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                            }}>
                                <span className="results-score-number">{finalScore}</span>
                                <span className="results-score-total">/ {totalQuestions}</span>
                            </div>
                        </div>

                        <p className="results-message">
                            {finalPassed
                                ? 'لقد تم فتح الخطوة التالية في خارطة الطريق!'
                                : `تحتاج حد أدنى ${passingScore} إجابات صحيحة للنجاح. حاول مرة أخرى!`
                            }
                        </p>

                        <div className="results-stars">
                            {[...Array(totalQuestions)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`results-star ${i < finalScore ? 'earned' : 'empty'}`}
                                    style={{ color: i < finalScore ? '#fdcb6e' : 'rgba(255,255,255,0.1)' }}
                                />
                            ))}
                        </div>

                        {/* Answer review */}
                        <div className="results-review">
                            {answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`review-item ${answer.isCorrect ? 'correct' : 'wrong'}`}
                                >
                                    <span className="review-number">س{index + 1}</span>
                                    <span className="review-status">
                                        {answer.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="results-actions">
                            {!finalPassed && (
                                <button onClick={handleRestart} className="results-btn retry-btn">
                                    <FaRedo />
                                    أعد المحاولة
                                </button>
                            )}
                            <Link
                                to={`/roadmap/${id}`}
                                className="results-btn roadmap-btn"
                                style={{ background: roadmap.gradient }}
                            >
                                العودة لخارطة الطريق
                                <FaArrowLeft />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const question = quiz[currentQuestion];

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                {/* Quiz header */}
                <motion.div
                    className="quiz-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link to={`/roadmap/${id}/step/${stepId}`} className="quiz-back-link">
                        رجوع للخطوة
                    </Link>
                    <h2 className="quiz-step-title" style={{ color: roadmap.color }}>
                        اختبار: {step.title}
                    </h2>
                </motion.div>

                {/* Progress */}
                <motion.div
                    className="quiz-progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="quiz-progress-bar">
                        <motion.div
                            className="quiz-progress-fill"
                            style={{ background: roadmap.gradient }}
                            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <span className="quiz-progress-text">
                        السؤال {currentQuestion + 1} من {totalQuestions}
                    </span>
                </motion.div>

                {/* Question card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        className="quiz-question-card glass"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="quiz-question-text">{question.question}</h3>

                        <div className="quiz-options">
                            {question.options.map((option, index) => {
                                let optionClass = 'quiz-option';
                                if (isAnswered) {
                                    if (index === question.correct) {
                                        optionClass += ' correct';
                                    } else if (index === selectedAnswer && index !== question.correct) {
                                        optionClass += ' wrong';
                                    } else {
                                        optionClass += ' dimmed';
                                    }
                                }
                                if (selectedAnswer === index && !isAnswered) {
                                    optionClass += ' selected';
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        className={optionClass}
                                        onClick={() => handleAnswer(index)}
                                        disabled={isAnswered}
                                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                        id={`quiz-option-${currentQuestion}-${index}`}
                                    >
                                        <span className="option-letter">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="option-text">{option}</span>
                                        {isAnswered && index === question.correct && (
                                            <FaCheckCircle className="option-feedback-icon correct-icon" />
                                        )}
                                        {isAnswered && index === selectedAnswer && index !== question.correct && (
                                            <FaTimesCircle className="option-feedback-icon wrong-icon" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        <AnimatePresence>
                            {isAnswered && (
                                <motion.div
                                    className={`quiz-feedback ${selectedAnswer === question.correct ? 'feedback-correct' : 'feedback-wrong'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {selectedAnswer === question.correct
                                        ? '✅ إجابة صحيحة! أحسنت!'
                                        : `❌ إجابة خاطئة. الإجابة الصحيحة: ${question.options[question.correct]}`
                                    }
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Next button */}
                        {isAnswered && (
                            <motion.button
                                className="quiz-next-btn"
                                style={{ background: roadmap.gradient }}
                                onClick={handleNext}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                id="quiz-next-button"
                            >
                                {currentQuestion + 1 < totalQuestions ? 'السؤال التالي' : 'عرض النتيجة'}
                                <FaArrowLeft style={{ marginRight: '8px' }} />
                            </motion.button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default QuizPage;
