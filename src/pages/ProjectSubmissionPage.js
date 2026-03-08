import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCode, FaUpload, FaCheckCircle, FaTimesCircle, FaArrowRight, FaTasks } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './ProjectSubmissionPage.css';

function ProjectSubmissionPage() {
    const { id, stepId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [code, setCode] = useState('// اكتب كودك هنا...\n\nfunction solution() {\n  return "مرحباً بالعالم";\n}\n\nconsole.log(solution());');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Mock project data since we haven't mapped front-end steps to backend IDs perfectly yet
    // In a real flow, we'd fetch the specific project ID using the stepId
    const mockProject = {
        title: 'تحدي: طباعة مرحباً بالعالم',
        description: 'اكتب دالة تقوم بإرجاع النص "مرحباً بالعالم" واطبعه في سطر الأوامر.',
        type: 'code',
        autoGrade: true,
        maxPoints: 50,
    };

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleSubmit = async () => {
        if (!code.trim()) return alert('الكود فارغ');

        setLoading(true);
        try {
            // In the real system, you'd fetch the project ID for this step
            // For demonstration, simulating auto-grading based on the codebase logic

            // MOCK: Testing logic (similar to backend)
            const isPass = code.includes('مرحباً بالعالم');

            setTimeout(() => {
                setResult({
                    status: isPass ? 'passed' : 'failed',
                    grade: isPass ? mockProject.maxPoints : 0,
                    testResults: [
                        {
                            input: 'Run code',
                            expectedOutput: 'مرحباً بالعالم',
                            actualOutput: isPass ? 'مرحباً بالعالم' : 'Output did not match',
                            passed: isPass
                        }
                    ]
                });
                setLoading(false);
            }, 1500);

            // REAL API CALL (commented out until steps are mapped to backend ObjectIds)
            /*
            const res = await api.post(`/projects/${projectId}/submit`, { content: code });
            setResult(res.data.data);
            */
        } catch (e) {
            console.error(e);
            alert('حدث خطأ أثناء التسليم');
            setLoading(false);
        }
    };

    return (
        <div className="project-submission-page">
            <button className="btn-back" onClick={() => navigate(`/roadmap/${id}/step/${stepId}`)}>
                <FaArrowRight /> للعودة للدرس
            </button>

            <div className="project-layout">
                <motion.div
                    className="project-brief glass"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="brief-header">
                        <FaTasks className="brief-icon" />
                        <h2>{mockProject.title}</h2>
                        <span className="points-badge">{mockProject.maxPoints} نقطة XP</span>
                    </div>

                    <div className="brief-content">
                        <h3>المطلوب:</h3>
                        <p>{mockProject.description}</p>

                        <div className="brief-warning">
                            <strong>ملاحظة:</strong> سيتم تقييم الكود الخاص بك تلقائياً بمطابقة المخرجات. تأكد من أن المخرجات مطابقة تماماً للمطلوب.
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="project-editor glass"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="editor-header">
                        <h3><FaCode /> محرر الأكواد</h3>
                    </div>

                    <textarea
                        className="code-textarea"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />

                    <div className="editor-footer">
                        <button
                            className="btn-submit-code"
                            onClick={handleSubmit}
                            disabled={loading || result?.status === 'passed'}
                        >
                            {loading ? <div className="loader-small"></div> : <><FaUpload /> تسليم المشروع</>}
                        </button>
                    </div>
                </motion.div>
            </div>

            {result && (
                <motion.div
                    className={`project-result glass ${result.status}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="result-header">
                        {result.status === 'passed' ? (
                            <><FaCheckCircle className="icon-pass" /> <h3>تم اجتياز التحدي بنجاح!</h3></>
                        ) : (
                            <><FaTimesCircle className="icon-fail" /> <h3>المشروع لم يجتز الاختبارات</h3></>
                        )}
                    </div>

                    <div className="result-details">
                        <div className="result-grade">الدرجة: {result.grade} / {mockProject.maxPoints} نقطة</div>

                        <h4>تفاصيل الاختبار:</h4>
                        {result.testResults?.map((test, index) => (
                            <div key={index} className={`test-case ${test.passed ? 'pass' : 'fail'}`}>
                                <div><strong>المدخل:</strong> {test.input}</div>
                                <div><strong>المخرج المتوقع:</strong> {test.expectedOutput}</div>
                                <div><strong>المخرج الفعلي:</strong> {test.actualOutput}</div>
                                <div className="test-status">
                                    {test.passed ? '✅ نجاح' : '❌ فشل'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {result.status === 'passed' && (
                        <button className="btn-continue" onClick={() => navigate(`/roadmap/${id}`)}>
                            استمر في التعلم
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}

export default ProjectSubmissionPage;
