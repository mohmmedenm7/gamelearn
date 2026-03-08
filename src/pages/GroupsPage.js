import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaSearch, FaUserPlus, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { groupService, roadmapService } from '../services/api';
import './GroupsPage.css';

function GroupsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my_groups');
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [createData, setCreateData] = useState({ name: '', description: '', isPrivate: false, roadmaps: [] });
    const [availableRoadmaps, setAvailableRoadmaps] = useState([]);

    useEffect(() => {
        if (!user) navigate('/login');
        fetchMyGroups();
        fetchRoadmaps();
    }, [user, navigate]);

    const fetchMyGroups = async () => {
        setLoading(true);
        try {
            const res = await groupService.getMyGroups();
            setGroups(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoadmaps = async () => {
        try {
            const res = await roadmapService.getAll();
            setAvailableRoadmaps(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            setLoading(true);
            const res = await groupService.search(searchQuery);
            setSearchResults(res.data || []);
            setActiveTab('search');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await groupService.create(createData);
            setShowCreateModal(false);
            setCreateData({ name: '', description: '', isPrivate: false, roadmaps: [] });
            fetchMyGroups();
            setActiveTab('my_groups');
        } catch (e) {
            alert(e.response?.data?.message || 'فشل إنشاء المجموعة');
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            if (joinCode.includes('@')) {
                // Join by username (format: @username#groupId or something similar, simple version just username)
                // const username = joinCode.replace('@', '');
                alert('ميزة الانضمام عبر المستخدم تحتاج لرقم المجموعة. استخدم كود الدعوة حالياً.');
            } else {
                await groupService.joinByCode(joinCode);
                setShowJoinModal(false);
                setJoinCode('');
                fetchMyGroups();
                setActiveTab('my_groups');
            }
        } catch (e) {
            alert(e.response?.data?.message || 'فشل الانضمام');
        }
    };

    const renderGroupCard = (group, isSearch = false) => (
        <motion.div
            key={group._id}
            className="group-card-large glass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => isSearch ? null : navigate(`/groups/${group._id}`)}
        >
            <div className="group-card-header">
                <div className="group-card-title">
                    <div className="group-icon-large">{group.icon || '🏆'}</div>
                    <div>
                        <h3>{group.name}</h3>
                        <span className="creator-badge">المالك: {group.creator.name}</span>
                    </div>
                </div>
                {!isSearch && (
                    <div className="member-count">
                        <FaUsers /> {group.members.length} {group.maxMembers ? `/ ${group.maxMembers}` : ''}
                    </div>
                )}
            </div>

            <p className="group-card-desc">{group.description || 'لا يوجد وصف'}</p>

            <div className="group-card-footer">
                <div className="group-roadmaps">
                    {group.roadmaps?.map(r => (
                        <span key={r._id} className="roadmap-tag">{r.title}</span>
                    ))}
                </div>
                {isSearch ? (
                    <button className="btn-join-small" onClick={(e) => { e.stopPropagation(); setShowJoinModal(true); }}>
                        انضمام
                    </button>
                ) : (
                    <FaArrowLeft className="go-icon" />
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="groups-page">
            <div className="groups-header">
                <div className="groups-title">
                    <FaUsers className="title-icon" />
                    <h1>مجموعات التحدي</h1>
                    <p>تعلم وتنافس مع الأصدقاء لإكمال مسارات التعلم</p>
                </div>
                <div className="groups-actions">
                    <button className="btn-action primary" onClick={() => setShowCreateModal(true)}>
                        <FaPlus /> إنشاء مجموعة
                    </button>
                    <button className="btn-action secondary" onClick={() => setShowJoinModal(true)}>
                        <FaUserPlus /> الانضمام
                    </button>
                </div>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab ${activeTab === 'my_groups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my_groups')}
                >
                    مجموعاتي
                </button>
                <button
                    className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                >
                    البحث الجلوبال
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'my_groups' ? (
                    loading ? <div className="loader mx-auto"></div> :
                        groups.length === 0 ? (
                            <div className="empty-state glass">
                                <FaUsers className="empty-icon" />
                                <h3>لا توجد مجموعات</h3>
                                <p>قم بإنشاء مجموعة جديدة أو انضم لمجموعة موجودة للبدء في التحديات</p>
                            </div>
                        ) : (
                            <div className="groups-grid">
                                {groups.map(g => renderGroupCard(g))}
                            </div>
                        )
                ) : (
                    <div className="search-tab">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="ابحث عن مجموعات بالاسم أو الوصف..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button type="submit"><FaSearch /></button>
                        </form>

                        <div className="groups-grid">
                            {loading && searchQuery ? <div className="loader mx-auto"></div> :
                                searchResults.map(g => renderGroupCard(g, true))}
                            {!loading && searchResults.length === 0 && searchQuery && (
                                <p className="text-center text-muted">لا توجد نتائج</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>إنشاء مجموعة جديدة</h2>
                            <button onClick={() => setShowCreateModal(false)}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleCreateGroup}>
                            <div className="form-group">
                                <label>اسم المجموعة</label>
                                <input required type="text" value={createData.name} onChange={e => setCreateData({ ...createData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>الوصف</label>
                                <textarea value={createData.description} onChange={e => setCreateData({ ...createData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label>نوع المجموعة</label>
                                <div className="toggle-switch">
                                    <input type="checkbox" id="isPrivate" checked={createData.isPrivate} onChange={e => setCreateData({ ...createData, isPrivate: e.target.checked })} />
                                    <label htmlFor="isPrivate">مجموعة خاصة (بالدعوة فقط)</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>مسارات التحدي (اختياري)</label>
                                <select multiple value={createData.roadmaps} onChange={e => setCreateData({ ...createData, roadmaps: Array.from(e.target.selectedOptions, option => option.value) })}>
                                    {availableRoadmaps.map(r => (
                                        <option key={r._id} value={r._id}>{r.title}</option>
                                    ))}
                                </select>
                                <small className="help-text">اضغط Ctrl لتحديد أكثر من مسار</small>
                            </div>
                            <button type="submit" className="btn-action primary full-width">إنشاء</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Join Modal */}
            {showJoinModal && (
                <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>الانضمام لمجموعة</h2>
                            <button onClick={() => setShowJoinModal(false)}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleJoin}>
                            <div className="form-group">
                                <label>كود الدعوة</label>
                                <input required type="text" placeholder="مثال: A8F9B2" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} />
                                <small className="help-text">اطلب كود الدعوة من منشئ المجموعة</small>
                            </div>
                            <button type="submit" className="btn-action secondary full-width">استمرار</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GroupsPage;
