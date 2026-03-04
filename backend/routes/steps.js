const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Step = require('../models/Step');
const Resource = require('../models/Resource');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/steps?roadmap=<id>
// @desc    Get all steps for a roadmap with resources + questions
// @access  Public
router.get('/', async (req, res) => {
    try {
        const filter = { isPublished: true };
        if (req.query.roadmap) filter.roadmap = req.query.roadmap;

        const steps = await Step.find(filter)
            .sort({ order: 1 })
            .populate('resources')
            .populate('questions');

        res.json({ success: true, data: steps });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/steps/:id
// @desc    Get single step with resources and questions
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const step = await Step.findById(req.params.id)
            .populate('resources')
            .populate({ path: 'questions', select: '-correct' }); // hide correct answer for public

        if (!step) return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });

        res.json({ success: true, data: step });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/steps/:id/quiz
// @desc    Get step quiz questions (with correct answers - only for authenticated users)
// @access  Private
router.get('/:id/quiz', protect, async (req, res) => {
    try {
        const step = await Step.findById(req.params.id);
        if (!step) return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });

        const questions = await Question.find({ step: req.params.id }).sort({ order: 1 });
        res.json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   POST /api/steps
// @desc    Create step (admin)
// @access  Admin
router.post('/', protect, adminOnly,
    [
        body('roadmap').notEmpty().withMessage('معرف خارطة الطريق مطلوب'),
        body('title').notEmpty().withMessage('عنوان الخطوة مطلوب'),
        body('description').notEmpty().withMessage('وصف الخطوة مطلوب'),
        body('order').isInt({ min: 1 }).withMessage('ترتيب الخطوة يجب أن يكون رقماً صحيحاً أكبر من 0')
    ],
    validate,
    async (req, res) => {
        try {
            const step = await Step.create({ ...req.body, createdBy: req.user._id });
            res.status(201).json({ success: true, message: 'تم إنشاء الخطوة', data: step });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// @route   PUT /api/steps/:id
// @desc    Update step (admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const step = await Step.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!step) return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });
        res.json({ success: true, message: 'تم تحديث الخطوة', data: step });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   DELETE /api/steps/:id
// @desc    Delete step + its resources + questions (admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const step = await Step.findById(req.params.id);
        if (!step) return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });

        await Resource.deleteMany({ step: req.params.id });
        await Question.deleteMany({ step: req.params.id });
        await step.deleteOne();

        res.json({ success: true, message: 'تم حذف الخطوة والبيانات المرتبطة بها' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
