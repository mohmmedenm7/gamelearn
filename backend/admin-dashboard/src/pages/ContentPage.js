import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaArrowRight, FaYoutube, FaBookOpen } from 'react-icons/fa';
import {
    getResources, createResource, updateResource, deleteResource,
    getQuestions, createQuestion, updateQuestion, deleteQuestion
} from '../services/api';

const EMPTY_RES = { title: '', url: '', type: 'video', platform: '', order: 0 };
const EMPTY_Q = { question: '', options: ['', '', '', ''], correct: 0, explanation: '', order: 0 };

export default function ContentPage() {
    const { stepId } = useParams();
    const [resources, setResources] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState(null);

    // Modals
    const [resModal, setResModal] = useState(false);
    const [qModal, setQModal] = useState(false);
    const [editingRes, setEditingRes] = useState(null);
    const [editingQ, setEditingQ] = useState(null);
    const [resForm, setResForm] = useState(EMPTY_RES);
    const [qForm, setQForm] = useState(EMPTY_Q);
    const [saving, setSaving] = useState(false);
    const [resError, setResError] = useState(null);
    const [qError, setQError] = useState(null);

    const loadAll = async () => {
        const [r, q] = await Promise.all([getResources(stepId), getQuestions(stepId)]);
        setResources(r.data.data); setQuestions(q.data.data); setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadAll(); }, [stepId]);

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 2000); };

    // ---- RESOURCES ----
    const openResCreate = () => { setResForm({ ...EMPTY_RES, order: resources.length }); setEditingRes(null); setResError(null); setResModal(true); };
    const openResEdit = (r) => { setResForm({ title: r.title, url: r.url, type: r.type, platform: r.platform || '', order: r.order }); setEditingRes(r); setResError(null); setResModal(true); };

    const handleSaveRes = async (e) => {
        e.preventDefault(); setSaving(true); setResError(null);
        try {
            if (editingRes) { await updateResource(editingRes._id, resForm); }
            else { await createResource({ ...resForm, step: stepId }); }
            setResModal(false); await loadAll(); showSuccess('تم حفظ المصدر');
        } catch (err) { setResError(err.response?.data?.message || 'فشل الحفظ'); }
        finally { setSaving(false); }
    };

    const handleDeleteRes = async (id) => {
        if (!window.confirm('حذف هذا المصدر؟')) return;
        await deleteResource(id); await loadAll(); showSuccess('تم الحذف');
    };

    // ---- QUESTIONS ----
    const openQCreate = () => { setQForm({ ...EMPTY_Q, order: questions.length }); setEditingQ(null); setQError(null); setQModal(true); };
    const openQEdit = (q) => { setQForm({ question: q.question, options: [...q.options], correct: q.correct, explanation: q.explanation || '', order: q.order }); setEditingQ(q); setQError(null); setQModal(true); };

    const handleSaveQ = async (e) => {
        e.preventDefault(); setSaving(true); setQError(null);
        try {
            const validOptions = qForm.options.filter(o => o.trim() !== '');
            if (validOptions.length < 2) { setQError('يجب إضافة خيارين على الأقل'); setSaving(false); return; }
            if (qForm.correct >= validOptions.length) { setQError('رقم الإجابة الصحيحة خارج النطاق'); setSaving(false); return; }
            const payload = { ...qForm, options: validOptions, step: stepId };
            if (editingQ) { await updateQuestion(editingQ._id, payload); }
            else { await createQuestion(payload); }
            setQModal(false); await loadAll(); showSuccess('تم حفظ السؤال');
        } catch (err) { setQError(err.response?.data?.message || 'فشل الحفظ'); }
        finally { setSaving(false); }
    };

    const handleDeleteQ = async (id) => {
        if (!window.confirm('حذف هذا السؤال؟')) return;
        await deleteQuestion(id); await loadAll(); showSuccess('تم الحذف');
    };

    const updateOption = (index, value) => {
        const opts = [...qForm.options];
        opts[index] = value;
        setQForm({ ...qForm, options: opts });
    };

    const addOption = () => setQForm({ ...qForm, options: [...qForm.options, ''] });
    const removeOption = (i) => {
        const opts = qForm.options.filter((_, idx) => idx !== i);
        setQForm({ ...qForm, options: opts, correct: Math.min(qForm.correct, Math.max(0, opts.length - 1)) });
    };

    if (loading) return <div className="empty-state"><div className="empty-state-icon">⏳</div></div>;

    return (
        <div className="animate-in">
            <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ marginBottom: 6 }}>
                        <Link to={-1} className="btn btn-secondary btn-sm"><FaArrowRight /> رجوع</Link>
                    </div>
                    <h1 className="page-title">محتوى الخطوة 📂</h1>
                    <p className="page-subtitle">إدارة المصادر وأسئلة الاختبار</p>
                </div>
            </div>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {/* RESOURCES */}
            <div className="content-card" style={{ marginBottom: 24 }}>
                <div className="content-card-header">
                    <span className="content-card-title">📚 المصادر التعليمية ({resources.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openResCreate} id="add-resource-btn"><FaPlus /> إضافة مصدر</button>
                </div>
                <div className="content-card-body">
                    {resources.length === 0 ? (
                        <div className="empty-state" style={{ padding: 32 }}>
                            <div className="empty-state-icon">📖</div>
                            <div className="empty-state-text">لا توجد مصادر تعليمية</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th>النوع</th><th>العنوان</th><th>المنصة</th><th>الرابط</th><th>إجراءات</th></tr></thead>
                            <tbody>
                                {resources.map(r => (
                                    <tr key={r._id}>
                                        <td>
                                            <span className={`badge ${r.type === 'video' ? 'badge-danger' : 'badge-primary'}`}>
                                                {r.type === 'video' ? <><FaYoutube /> فيديو</> : <><FaBookOpen /> مقال</>}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{r.title}</td>
                                        <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-english)', fontSize: '0.8rem' }}>{r.platform}</td>
                                        <td><a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-info)', fontSize: '0.8rem', fontFamily: 'var(--font-english)' }}>فتح الرابط ↗</a></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openResEdit(r)}><FaEdit /></button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRes(r._id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* QUESTIONS */}
            <div className="content-card">
                <div className="content-card-header">
                    <span className="content-card-title">❓ أسئلة الاختبار ({questions.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openQCreate} id="add-question-btn"><FaPlus /> إضافة سؤال</button>
                </div>
                <div className="content-card-body">
                    {questions.length === 0 ? (
                        <div className="empty-state" style={{ padding: 32 }}>
                            <div className="empty-state-icon">❓</div>
                            <div className="empty-state-text">لا توجد أسئلة بعد</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th>#</th><th>السؤال</th><th>الخيارات</th><th>الإجابة الصحيحة</th><th>إجراءات</th></tr></thead>
                            <tbody>
                                {questions.map((q, idx) => (
                                    <tr key={q._id}>
                                        <td><span className="badge badge-warning">{idx + 1}</span></td>
                                        <td style={{ fontWeight: 600, maxWidth: 220 }}>{q.question}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{q.options.length} خيارات</td>
                                        <td>
                                            <span className="badge badge-success">{q.options[q.correct]}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openQEdit(q)}><FaEdit /></button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteQ(q._id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Resource Modal */}
            {resModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setResModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingRes ? 'تعديل مصدر' : 'إضافة مصدر تعليمي'}</h3>
                            <button className="modal-close" onClick={() => setResModal(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            {resError && <div className="alert alert-danger">{resError}</div>}
                            <form onSubmit={handleSaveRes}>
                                <div className="form-group">
                                    <label className="form-label">عنوان المصدر *</label>
                                    <input className="form-control" value={resForm.title} onChange={e => setResForm({ ...resForm, title: e.target.value })} required placeholder="مثال: مقدمة في الجبر" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رابط المصدر *</label>
                                    <input className="form-control" type="url" value={resForm.url} onChange={e => setResForm({ ...resForm, url: e.target.value })} required placeholder="https://..." style={{ direction: 'ltr' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div className="form-group">
                                        <label className="form-label">النوع</label>
                                        <select className="form-control" value={resForm.type} onChange={e => setResForm({ ...resForm, type: e.target.value })}>
                                            <option value="video">فيديو</option>
                                            <option value="article">مقال</option>
                                            <option value="course">كورس</option>
                                            <option value="book">كتاب</option>
                                            <option value="other">أخرى</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">المنصة</label>
                                        <input className="form-control" value={resForm.platform} onChange={e => setResForm({ ...resForm, platform: e.target.value })} placeholder="YouTube, Khan Academy..." style={{ direction: 'ltr' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setResModal(false)}>إلغاء</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-resource-btn">
                                        {saving ? <span className="spinner"></span> : 'حفظ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {qModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setQModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingQ ? 'تعديل سؤال' : 'إضافة سؤال اختبار'}</h3>
                            <button className="modal-close" onClick={() => setQModal(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            {qError && <div className="alert alert-danger">{qError}</div>}
                            <form onSubmit={handleSaveQ}>
                                <div className="form-group">
                                    <label className="form-label">نص السؤال *</label>
                                    <textarea className="form-control" value={qForm.question} onChange={e => setQForm({ ...qForm, question: e.target.value })} required rows={2} placeholder="اكتب السؤال هنا..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">خيارات الإجابة *</label>
                                    {qForm.options.map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                            <input
                                                type="radio"
                                                name="correct"
                                                checked={qForm.correct === i}
                                                onChange={() => setQForm({ ...qForm, correct: i })}
                                                title="اختر هذا كإجابة صحيحة"
                                                style={{ flexShrink: 0 }}
                                            />
                                            <input
                                                className="form-control"
                                                value={opt}
                                                onChange={e => updateOption(i, e.target.value)}
                                                placeholder={`الخيار ${i + 1}`}
                                                style={{ flex: 1 }}
                                            />
                                            {qForm.options.length > 2 && (
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOption(i)} style={{ padding: '6px 8px' }}><FaTimes /></button>
                                            )}
                                        </div>
                                    ))}
                                    {qForm.options.length < 6 && (
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={addOption} style={{ marginTop: 4 }}>
                                            <FaPlus /> إضافة خيار
                                        </button>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                        💡 انقر على الدائرة بجانب الخيار الصحيح
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">تفسير الإجابة (اختياري)</label>
                                    <input className="form-control" value={qForm.explanation} onChange={e => setQForm({ ...qForm, explanation: e.target.value })} placeholder="اشرح لماذا هذه الإجابة صحيحة..." />
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setQModal(false)}>إلغاء</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-question-btn">
                                        {saving ? <span className="spinner"></span> : 'حفظ'}
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
