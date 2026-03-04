const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Resource = require('../models/Resource');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/resources?step=<id>
router.get('/', async (req, res) => {
    try {
        const filter = req.query.step ? { step: req.query.step } : {};
        const resources = await Resource.find(filter).sort({ order: 1 });
        res.json({ success: true, data: resources });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   POST /api/resources (admin)
router.post('/', protect, adminOnly,
    [
        body('step').notEmpty().withMessage('معرف الخطوة مطلوب'),
        body('title').notEmpty().withMessage('عنوان المصدر مطلوب'),
        body('url').isURL().withMessage('رابط المصدر غير صالح')
    ],
    validate,
    async (req, res) => {
        try {
            const resource = await Resource.create({ ...req.body, createdBy: req.user._id });
            res.status(201).json({ success: true, message: 'تم إضافة المصدر', data: resource });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// @route   PUT /api/resources/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!resource) return res.status(404).json({ success: false, message: 'المصدر غير موجود' });
        res.json({ success: true, message: 'تم تحديث المصدر', data: resource });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   DELETE /api/resources/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).json({ success: false, message: 'المصدر غير موجود' });
        res.json({ success: true, message: 'تم حذف المصدر' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
