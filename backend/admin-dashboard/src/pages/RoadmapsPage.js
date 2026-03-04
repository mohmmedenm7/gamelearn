import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAllRoadmaps, createRoadmap, updateRoadmap, deleteRoadmap } from '../services/api';

const EMPTY_FORM = { title: '', titleEn: '', description: '', icon: '📚', color: '#6c5ce7', colorSecondary: '#a29bfe', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', isPublished: true, order: 0 };

function RoadmapsPage() {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const load = () => getAllRoadmaps().then(r => setRoadmaps(r.data.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setError(null); setShowModal(true); };
    const openEdit = (r) => { setForm({ title: r.title, titleEn: r.titleEn || '', description: r.description, icon: r.icon, color: r.color, colorSecondary: r.colorSecondary, gradient: r.gradient, isPublished: r.isPublished, order: r.order }); setEditing(r); setError(null); setShowModal(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError(null);
        try {
            if (editing) { await updateRoadmap(editing._id, form); setSuccessMsg('تم تحديث خارطة الطريق'); }
            else { await createRoadmap(form); setSuccessMsg('تم إنشاء خارطة الطريق'); }
            setShowModal(false);
            await load();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'فشل الحفظ');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف خارطة الطريق وجميع خطواتها؟')) return;
        try { await deleteRoadmap(id); await load(); setSuccessMsg('تم الحذف'); setTimeout(() => setSuccessMsg(null), 2000); }
        catch (err) { alert(err.response?.data?.message || 'فشل الحذف'); }
    };

    const togglePublish = async (r) => {
        try { await updateRoadmap(r._id, { isPublished: !r.isPublished }); await load(); }
        catch (err) { alert(err.response?.data?.message || 'فشل'); }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">خرائط الطريق 🗺️</h1>
                    <p className="page-subtitle">إدارة المجالات التعليمية</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-roadmap-btn">
                    <FaPlus /> إضافة مجال جديد
                </button>
            </div>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <div className="content-card">
                <div className="content-card-body">
                    {loading ? (
                        <div className="empty-state"><span className="big-spinner" style={{ width: 32, height: 32, border: '2px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span></div>
                    ) : roadmaps.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🗺️</div>
                            <div className="empty-state-text">لا توجد خرائط طريق بعد</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th>المجال</th><th>الخطوات</th><th>الترتيب</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                            <tbody>
                                {roadmaps.map(r => (
                                    <tr key={r._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '1.4rem' }}>{r.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                                                    {r.titleEn && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-english)' }}>{r.titleEn}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-primary">{r.stepsCount || 0} خطوات</span></td>
                                        <td style={{ color: 'var(--text-muted)' }}>{r.order}</td>
                                        <td>
                                            <span className={`badge ${r.isPublished ? 'badge-success' : 'badge-danger'}`}>
                                                {r.isPublished ? 'منشور' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                <Link to={`/roadmaps/${r._id}/steps`} className="btn btn-secondary btn-sm">الخطوات</Link>
                                                <button className="btn btn-secondary btn-sm" onClick={() => togglePublish(r)} title={r.isPublished ? 'إخفاء' : 'نشر'}>
                                                    {r.isPublished ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}><FaEdit /></button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? 'تعديل المجال' : 'إضافة مجال جديد'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">العنوان بالعربية *</label>
                                    <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="مثال: الرياضيات" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">العنوان بالإنجليزية</label>
                                    <input className="form-control" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} placeholder="e.g. Mathematics" style={{ direction: 'ltr' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">الوصف *</label>
                                    <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                    <div className="form-group">
                                        <label className="form-label">الأيقونة</label>
                                        <input className="form-control" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📚" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">اللون الرئيسي</label>
                                        <input type="color" className="form-control" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: 4 }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">الترتيب</label>
                                        <input type="number" className="form-control" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} min={0} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                                        <span className="form-label" style={{ margin: 0 }}>منشور (مرئي للمستخدمين)</span>
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-roadmap-btn">
                                        {saving ? <span className="spinner"></span> : (editing ? 'حفظ التعديلات' : 'إنشاء المجال')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapsPage;
