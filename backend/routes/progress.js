const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/progress
// @desc    Get current user's progress
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('progress');
        res.json({ success: true, data: user.progress });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   POST /api/progress/complete
// @desc    Mark a step as completed after passing quiz
// @access  Private
router.post('/complete',
    [
        body('roadmapId').notEmpty().withMessage('معرف خارطة الطريق مطلوب'),
        body('stepId').notEmpty().withMessage('معرف الخطوة مطلوب'),
        body('score').isInt({ min: 0 }).withMessage('النتيجة مطلوبة'),
        body('total').isInt({ min: 1 }).withMessage('المجموع الكلي مطلوب')
    ],
    validate,
    protect,
    async (req, res) => {
        try {
            const { roadmapId, stepId, score, total } = req.body;
            const passingScore = Math.ceil(total * 0.6);

            if (score < passingScore) {
                return res.status(400).json({
                    success: false,
                    message: `لم تجتز الاختبار. الحد الأدنى: ${passingScore} من ${total}`,
                    passed: false
                });
            }

            // Update user progress
            const user = await User.findById(req.user._id);
            if (!user.progress) user.progress = new Map();
            if (!user.progress.get(roadmapId)) {
                user.progress.set(roadmapId, new Map());
            }
            user.progress.get(roadmapId).set(stepId, true);
            user.markModified('progress');
            await user.save();

            res.json({
                success: true,
                message: 'تهانينا! تم اجتياز الاختبار وحفظ تقدمك',
                passed: true,
                data: user.progress
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
);

// @route   DELETE /api/progress/reset
// @desc    Reset all progress for a roadmap
// @access  Private
router.delete('/reset/:roadmapId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.progress) {
            user.progress.delete(req.params.roadmapId);
            user.markModified('progress');
            await user.save();
        }
        res.json({ success: true, message: 'تم إعادة تعيين التقدم' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

module.exports = router;
