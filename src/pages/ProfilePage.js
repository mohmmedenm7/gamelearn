import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaTrophy, FaStar, FaFire, FaGamepad, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authService, groupService } from '../services/api';
import CharacterAvatar from '../components/CharacterAvatar';
import CharacterBuilder from '../components/CharacterBuilder';
import './ProfilePage.css';

function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [statsRes, groupsRes] = await Promise.all([
                    authService.getCurrentUser(), // Gets fresh user with populated stats
                    groupService.getMyGroups()
                ]);
                setStats(statsRes.stats || {
                    totalAttempts: 0,
                    passedAttempts: 0,
                    totalPoints: user.points || 0,
                    averageAccuracy: 0
                });
                setGroups(groupsRes.data || []);
            } catch (err) {
                console.error('Failed to fetch profile data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="profile-loading">
                <div className="loader"></div>
                <p>جاري تحميل الملف الشخصي...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="profile-page">
            <motion.div
                className="profile-header glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="profile-avatar-section">
                    <div className="avatar-wrapper">
                        <CharacterAvatar avatar={user.avatar} size={150} />
                        <button className="edit-avatar-btn" onClick={() => setShowBuilder(true)}>
                            <FaUserEdit /> تعديل
                        </button>
                    </div>
                    <div className="profile-info">
                        <h2>{user.name}</h2>
                        <p className="username">@{user.username}</p>
                        <div className="level-badge">
                            <FaTrophy className="level-icon" />
                            <span>المستوى {user.level || 1}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-box">
                        <FaStar className="stat-icon text-yellow" />
                        <span className="stat-value">{user.points || 0}</span>
                        <span className="stat-label">نقطة XP</span>
                    </div>
                    <div className="stat-box">
                        <FaFire className="stat-icon text-orange" />
                        <span className="stat-value">{user.streak || 0}</span>
                        <span className="stat-label">أيام متتالية</span>
                    </div>
                    <div className="stat-box">
                        <FaGamepad className="stat-icon text-purple" />
                        <span className="stat-value">{stats?.passedAttempts || 0}</span>
                        <span className="stat-label">اختبار ناجح</span>
                    </div>
                </div>
            </motion.div>

            <div className="profile-content">
                <motion.div
                    className="content-section glass"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-header">
                        <h3><FaUsers /> مجموعاتي ({groups.length})</h3>
                        <button className="btn-secondary" onClick={() => navigate('/groups')}>تصفح المجموعات</button>
                    </div>

                    {groups.length === 0 ? (
                        <div className="empty-state">
                            <img src="/img/empty-groups.svg" alt="لا توجد مجموعات" className="empty-img" onError={(e) => e.target.style.display = 'none'} />
                            <p>لست منضماً لأي مجموعة حالياً</p>
                            <button className="btn-primary" onClick={() => navigate('/groups')}>انضم لمجموعة الآن</button>
                        </div>
                    ) : (
                        <div className="groups-list">
                            {groups.map(group => (
                                <div key={group._id} className="group-card" onClick={() => navigate(`/groups/${group._id}`)}>
                                    <div className="group-icon">{group.icon || '🏆'}</div>
                                    <div className="group-details">
                                        <h4>{group.name}</h4>
                                        <p>{group.members.length} أعضاء</p>
                                    </div>
                                    <FaArrowLeft className="group-arrow" />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="content-section glass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-header">
                        <h3>المشاريع والتسليمات</h3>
                    </div>
                    <div className="empty-state">
                        <FaGamepad className="empty-icon text-purple" />
                        <p>لا توجد تسليمات لمشاريع حتى الآن</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>ابدأ مساراً التعليمياً</button>
                    </div>
                </motion.div>
            </div>

            {/* Character Builder Modal */}
            <AnimatePresence>
                {showBuilder && (
                    <motion.div
                        className="builder-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="builder-modal-content">
                            <CharacterBuilder
                                currentAvatar={user.avatar}
                                onClose={() => setShowBuilder(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProfilePage;
