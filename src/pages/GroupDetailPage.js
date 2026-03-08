import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaArrowRight, FaCrown, FaStar, FaShareAlt, FaCog, FaSignOutAlt, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/api';
import CharacterAvatar from '../components/CharacterAvatar';
import './GroupDetailPage.css';

function GroupDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchGroupDetails();
    }, [id, user, navigate]);

    const fetchGroupDetails = async () => {
        try {
            const res = await groupService.getDetails(id);
            setGroupData(res.data);
        } catch (e) {
            console.error(e);
            alert('المجموعة غير موجودة أو أنك لست عضواً بها');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: groupData.group.name,
                text: `انضم لمجموعتي في GameLearn وتحداني! كود الدعوة: ${groupData.group.inviteCode}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(`كود الانضمام للمجموعة: ${groupData.group.inviteCode}`);
            alert('تم نسخ كود الانضمام للحافظة');
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm('هل أنت متأكد أنك تريد مغادرة هذه المجموعة؟')) {
            try {
                await groupService.leaveGroup(id);
                navigate('/groups');
            } catch (e) {
                alert(e.response?.data?.message || 'فشل مغادرة المجموعة');
            }
        }
    };

    if (loading) return <div className="loader absolute-center"></div>;
    if (!groupData) return null;

    const { group, memberProgress } = groupData;
    const isCreator = group.creator._id === user._id;

    return (
        <div className="group-detail-page">
            <button className="btn-back" onClick={() => navigate('/groups')}>
                <FaArrowRight /> رجوع للمجموعات
            </button>

            <motion.div
                className="group-header glass"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="group-info">
                    <h1>{group.name}</h1>
                    <p>{group.description || 'تحدي التعلم المشترك'}</p>

                    <div className="group-meta">
                        <span className="meta-tag"><FaUsers /> {group.members.length} أعضاء</span>
                        <span className="invite-code" onClick={handleShare} title="اضغط للنسخ">
                            كود الدعوة: <strong>{group.inviteCode}</strong> <FaShareAlt />
                        </span>
                    </div>

                    <div className="group-roadmaps mt-2">
                        <strong>مسارات التحدي: </strong>
                        {group.roadmaps.length > 0
                            ? group.roadmaps.map(r => <span key={r._id} className="roadmap-badge">{r.title}</span>)
                            : <span className="text-muted">عام (لا يوجد مسار محدد)</span>
                        }
                    </div>
                </div>

                <div className="group-actions">
                    {isCreator ? (
                        <button className="btn-secondary" onClick={() => alert('إعدادات المجموعة قادمة قريباً')}>
                            <FaCog /> إعدادات
                        </button>
                    ) : (
                        <button className="btn-leave" onClick={handleLeaveGroup}>
                            <FaSignOutAlt /> مغادرة
                        </button>
                    )}
                </div>
            </motion.div>

            <motion.div
                className="group-leaderboard glass"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2><FaTrophy className="text-yellow" /> لوحة صدارة المجموعة</h2>
                <p className="text-muted mb-4">الترتيب يعتمد على النقاط المكتسبة <strong>داخل هذه المجموعة فقط</strong></p>

                <div className="leaderboard-list">
                    {memberProgress.map((member, index) => {
                        const isMe = member.user.id === user._id;
                        return (
                            <motion.div
                                key={member.user.id}
                                className={`leaderboard-row ${isMe ? 'is-me' : ''} ${index < 3 ? 'top-rank' : ''}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <div className="rank-number">
                                    {index === 0 ? <FaCrown className="text-yellow text-2xl" /> :
                                        index === 1 ? <span className="text-gray-400 font-bold text-xl">2</span> :
                                            index === 2 ? <span className="text-orange-400 font-bold text-xl">3</span> :
                                                index + 1}
                                </div>

                                <div className="member-avatar">
                                    <CharacterAvatar avatar={member.user.avatar} size={50} />
                                </div>

                                <div className="member-info">
                                    <h3 className="member-name">
                                        {member.user.name} {isMe && <span className="me-badge">(أنت)</span>}
                                    </h3>
                                    <div className="member-level">المستوى {member.user.level || 1}</div>
                                </div>

                                <div className="member-score">
                                    <div className="score-value">{member.groupPoints}</div>
                                    <div className="score-label">نقطة تحدي</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}

export default GroupDetailPage;
