import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaArrowRight } from 'react-icons/fa';
import { getSteps, createStep, updateStep, deleteStep, getAllRoadmaps } from '../services/api';

const EMPTY = { title: '', description: '', order: 1, isPublished: true };

function StepsPage() {
    const { roadmapId } = useParams();
    const [steps, setSteps] = useState([]);
    const [roadmapName, setRoadmapName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const load = async () => {
        const [stepsRes, roadmapsRes] = await Promise.all([
            getSteps(roadmapId),
            getAllRoadmaps()
        ]);
        setSteps(stepsRes.data.data);
        const rm = roadmapsRes.data.data.find(r => r._id === roadmapId);
        if (rm) setRoadmapName(rm.title);
        setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(); }, [roadmapId]);

    const openCreate = () => { setForm({ ...EMPTY, order: (steps.length + 1) }); setEditing(null); setError(null); setShowModal(true); };
    const openEdit = (s) => { setForm({ title: s.title, description: s.description, order: s.order, isPublished: s.isPublished }); setEditing(s); setError(null); setShowModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true); setError(null);
        try {
            if (editing) { await updateStep(editing._id, form); setSuccessMsg('تم التحديث'); }
            else { await createStep({ ...form, roadmap: roadmapId }); setSuccessMsg('تم إنشاء الخطوة'); }
            setShowModal(false); await load();
            setTimeout(() => setSuccessMsg(null), 2000);
        } catch (err) { setError(err.response?.data?.message || 'فشل'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('حذف هذه الخطوة مع مصادرها وأسئلتها؟')) return;
        try { await deleteStep(id); await load(); }
        catch (err) { alert(err.response?.data?.message || 'فشل الحذف'); }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Link to="/roadmaps" className="btn btn-secondary btn-sm"><FaArrowRight /> الرجوع</Link>
                    </div>
                    <h1 className="page-title">خطوات: {roadmapName} 📋</h1>
                    <p className="page-subtitle">إدارة خطوات هذا المجال التعليمي</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-step-btn"><FaPlus /> إضافة خطوة</button>
            </div>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <div className="content-card">
                <div className="content-card-body">
                    {loading ? (
                        <div className="empty-state"><div className="empty-state-icon">⏳</div></div>
                    ) : steps.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <div className="empty-state-text">لا توجد خطوات بعد - اضغط "إضافة خطوة"</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th>#</th><th>العنوان</th><th>الوصف</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                            <tbody>
                                {steps.sort((a, b) => a.order - b.order).map(s => (
                                    <tr key={s._id}>
                                        <td><span className="badge badge-primary">{s.order}</span></td>
                                        <td style={{ fontWeight: 600 }}>{s.title}</td>
                                        <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', fontSize: '0.82rem' }}>{s.description?.substring(0, 80)}{s.description?.length > 80 ? '...' : ''}</td>
                                        <td><span className={`badge ${s.isPublished ? 'badge-success' : 'badge-danger'}`}>{s.isPublished ? 'منشور' : 'مخفي'}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Link to={`/steps/${s._id}/content`} className="btn btn-secondary btn-sm">المحتوى</Link>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><FaEdit /></button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">{editing ? 'تعديل الخطوة' : 'إضافة خطوة جديدة'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">عنوان الخطوة *</label>
                                    <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="مثال: الجبر الأساسي" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">وصف الخطوة *</label>
                                    <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} placeholder="اشرح ما سيتعلمه الطالب في هذه الخطوة..." />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div className="form-group">
                                        <label className="form-label">الترتيب *</label>
                                        <input type="number" className="form-control" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} min={1} required />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                                            <span className="form-label" style={{ margin: 0 }}>منشور</span>
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-step-btn">
                                        {saving ? <span className="spinner"></span> : (editing ? 'حفظ' : 'إنشاء')}
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

export default StepsPage;
