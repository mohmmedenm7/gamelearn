const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Roadmap = require('../models/Roadmap');
const Step = require('../models/Step');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/roadmaps
// @desc    Get all published roadmaps
// @access  Public
router.get('/', async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ isPublished: true })
            .populate('stepsCount')
            .sort({ order: 1, createdAt: -1 });

        res.json({ success: true, data: roadmaps });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/roadmaps/all (admin - includes unpublished)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find()
            .populate('stepsCount')
            .sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: roadmaps });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/roadmaps/:id
// @desc    Get single roadmap with all steps
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'خارطة الطريق غير موجودة' });
        }

        const steps = await Step.find({ roadmap: req.params.id, isPublished: true })
            .sort({ order: 1 });

        res.json({ success: true, data: { ...roadmap.toJSON(), steps } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   POST /api/roadmaps
// @desc    Create a new roadmap (admin)
// @access  Admin
router.post('/', protect, adminOnly,
    [
        body('title').notEmpty().withMessage('عنوان خارطة الطريق مطلوب'),
        body('description').notEmpty().withMessage('وصف خارطة الطريق مطلوب')
    ],
    validate,
    async (req, res) => {
        try {
            const roadmap = await Roadmap.create({
                ...req.body,
                createdBy: req.user._id
            });
            res.status(201).json({ success: true, message: 'تم إنشاء خارطة الطريق', data: roadmap });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// @route   PUT /api/roadmaps/:id
// @desc    Update roadmap (admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!roadmap) return res.status(404).json({ success: false, message: 'خارطة الطريق غير موجودة' });
        res.json({ success: true, message: 'تم تحديث خارطة الطريق', data: roadmap });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   DELETE /api/roadmaps/:id
// @desc    Delete roadmap and all its steps (admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ success: false, message: 'خارطة الطريق غير موجودة' });

        // Cascade delete steps, resources, questions
        const steps = await Step.find({ roadmap: req.params.id });
        const stepIds = steps.map(s => s._id);

        const Resource = require('../models/Resource');
        const Question = require('../models/Question');
        await Resource.deleteMany({ step: { $in: stepIds } });
        await Question.deleteMany({ step: { $in: stepIds } });
        await Step.deleteMany({ roadmap: req.params.id });
        await roadmap.deleteOne();

        res.json({ success: true, message: 'تم حذف خارطة الطريق والبيانات المرتبطة بها' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
