import React, { useEffect, useState } from 'react';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { getUsers, updateUserRole, deleteUser } from '../services/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const load = () => {
        getUsers()
            .then(r => setUsers(r.data.data))
            .catch(err => setError(err.response?.data?.message || 'فشل تحميل المستخدمين'))
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 2000); };

    const handleRoleChange = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`تغيير دور "${user.name}" إلى ${newRole === 'admin' ? 'مدير' : 'مستخدم'}؟`)) return;
        try {
            await updateUserRole(user._id, newRole);
            await load();
            showSuccess('تم تحديث الدور');
        } catch (err) { alert(err.response?.data?.message || 'فشل'); }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`حذف المستخدم "${user.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) return;
        try { await deleteUser(user._id); await load(); showSuccess('تم حذف المستخدم'); }
        catch (err) { alert(err.response?.data?.message || 'فشل الحذف'); }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">المستخدمون 👥</h1>
                    <p className="page-subtitle">إدارة حسابات المستخدمين والمدراء</p>
                </div>
            </div>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="content-card">
                <div className="content-card-body">
                    {loading ? (
                        <div className="empty-state"><div className="empty-state-icon">⏳</div></div>
                    ) : users.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <div className="empty-state-text">لا يوجد مستخدمون بعد</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>الدور</th>
                                    <th>تاريخ التسجيل</th>
                                    <th>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'admin' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white', flexShrink: 0 }}>
                                                    {u.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ direction: 'ltr', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-english)' }}>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-warning'}`}>
                                                {u.role === 'admin' ? '🛡️ مدير' : '👤 مستخدم'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => handleRoleChange(u)}
                                                    title={u.role === 'admin' ? 'تحويل لمستخدم عادي' : 'ترقية لمدير'}
                                                >
                                                    {u.role === 'admin' ? <FaUser /> : <FaUserShield />}
                                                    {u.role === 'admin' ? 'إزالة مدير' : 'جعله مدير'}
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)} title="حذف المستخدم">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
