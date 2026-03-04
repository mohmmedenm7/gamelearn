const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/questions?step=<id>  (admin - includes correct answers)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const filter = req.query.step ? { step: req.query.step } : {};
        const questions = await Question.find(filter).sort({ order: 1 });
        res.json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/questions/:id (admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'السؤال غير موجود' });
        res.json({ success: true, data: question });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   POST /api/questions (admin)
router.post('/', protect, adminOnly,
    [
        body('step').notEmpty().withMessage('معرف الخطوة مطلوب'),
        body('question').notEmpty().withMessage('نص السؤال مطلوب'),
        body('options').isArray({ min: 2 }).withMessage('يجب أن يكون هناك خيارين على الأقل'),
        body('correct').isInt({ min: 0 }).withMessage('رقم الإجابة الصحيحة مطلوب')
    ],
    validate,
    async (req, res) => {
        try {
            const question = await Question.create({ ...req.body, createdBy: req.user._id });
            res.status(201).json({ success: true, message: 'تم إضافة السؤال', data: question });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// @route   PUT /api/questions/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!question) return res.status(404).json({ success: false, message: 'السؤال غير موجود' });
        res.json({ success: true, message: 'تم تحديث السؤال', data: question });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   DELETE /api/questions/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'السؤال غير موجود' });
        res.json({ success: true, message: 'تم حذف السؤال' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
