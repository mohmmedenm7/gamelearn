import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaStar } from 'react-icons/fa';
import { userService } from '../services/api';
import CharacterAvatar from '../components/CharacterAvatar';
import './LeaderboardPage.css';

function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await userService.getLeaderboard();
            setLeaders(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const TopThree = () => {
        if (leaders.length < 3) return null;

        // Order for podium: 2, 1, 3
        const podiumOrder = [leaders[1], leaders[0], leaders[2]];

        return (
            <div className="podium-container">
                {podiumOrder.map((user, idx) => {
                    if (!user) return null;
                    const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                    const rankColor = rank === 1 ? '#fdcb6e' : rank === 2 ? '#b2bec3' : '#e17055';

                    return (
                        <motion.div
                            key={user._id}
                            className={`podium-item rank-${rank}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (3 - rank) * 0.2 }}
                        >
                            <div className="podium-avatar-container">
                                <CharacterAvatar avatar={user.avatar} size={100} />
                                <div className="podium-medal" style={{ background: rankColor }}>
                                    {rank}
                                </div>
                            </div>
                            <h3 className="podium-name">{user.name}</h3>
                            <p className="podium-points">{user.points} <FaStar className="text-yellow" /></p>

                            <div className="podium-base" style={{ height: rank === 1 ? '160px' : rank === 2 ? '120px' : '90px' }}>
                                <div className="podium-rank">{rank}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-header text-center mb-5">
                <h1 className="text-gradient"><FaGlobe /> تصنيف الأبطال الملحمي</h1>
                <p className="text-muted">أفضل المتعلمين على مستوى المنصة</p>
            </div>

            {loading ? (
                <div className="loader mx-auto"></div>
            ) : (
                <>
                    <TopThree />

                    <div className="global-list mt-5 glass">
                        {leaders.slice(3).map((user, index) => (
                            <motion.div
                                key={user._id}
                                className="leaderboard-row"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <div className="rank-number">{index + 4}</div>
                                <div className="member-avatar">
                                    <CharacterAvatar avatar={user.avatar} size={50} />
                                </div>
                                <div className="member-info">
                                    <h3 className="member-name">{user.name}</h3>
                                    <div className="member-level">المستوى {user.level || 1}</div>
                                </div>
                                <div className="member-score">
                                    <div className="score-value">{user.points}</div>
                                    <div className="score-label">XP</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default LeaderboardPage;
