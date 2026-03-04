import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaMap, FaListAlt, FaBookOpen, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { getStats } from '../services/api';
import './StatsPage.css';

function StatCard({ icon, label, value, color, sub }) {
    return (
        <div className="stat-card glass animate-in" style={{ '--card-color': color }}>
            <div className="stat-card-icon" style={{ background: color }}>{icon}</div>
            <div className="stat-card-info">
                <div className="stat-card-value">{value ?? '—'}</div>
                <div className="stat-card-label">{label}</div>
                {sub && <div className="stat-card-sub">{sub}</div>}
            </div>
        </div>
    );
}

function StatsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getStats()
            .then(res => setStats(res.data.data))
            .catch(err => setError(err.response?.data?.message || 'فشل تحميل الإحصائيات'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-spinner"><span className="spinner big-spinner"></span></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="stats-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">لوحة التحكم 📊</h1>
                    <p className="page-subtitle">نظرة عامة على البيانات والإحصائيات</p>
                </div>
                <Link to="/roadmaps" className="btn btn-primary">
                    <FaMap /> إدارة خرائط الطريق <FaArrowLeft />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard icon={<FaUsers />} label="المستخدمون" value={stats.totalUsers} color="#6c5ce7" />
                <StatCard icon={<FaMap />} label="خرائط الطريق" value={stats.totalRoadmaps} color="#00cec9"
                    sub={`${stats.publishedRoadmaps} منشورة`} />
                <StatCard icon={<FaListAlt />} label="الخطوات" value={stats.totalSteps} color="#fdcb6e" />
                <StatCard icon={<FaBookOpen />} label="المصادر التعليمية" value={stats.totalResources} color="#fd79a8" />
                <StatCard icon={<FaQuestionCircle />} label="أسئلة الاختبار" value={stats.totalQuestions} color="#74b9ff" />
            </div>

            {/* Recent Users */}
            {stats.recentUsers?.length > 0 && (
                <div className="content-card" style={{ marginTop: 32 }}>
                    <div className="content-card-header">
                        <span className="content-card-title">المستخدمون الجدد</span>
                        <Link to="/users" className="btn btn-secondary btn-sm">عرض الكل</Link>
                    </div>
                    <div className="content-card-body">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>تاريخ التسجيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td style={{ direction: 'ltr', textAlign: 'right', color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatsPage;
