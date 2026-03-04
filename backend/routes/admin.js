const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Step = require('../models/Step');
const Resource = require('../models/Resource');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            totalRoadmaps,
            totalSteps,
            totalResources,
            totalQuestions,
            recentUsers,
            publishedRoadmaps
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Roadmap.countDocuments(),
            Step.countDocuments(),
            Resource.countDocuments(),
            Question.countDocuments(),
            User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
            Roadmap.countDocuments({ isPublished: true })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalRoadmaps,
                publishedRoadmaps,
                totalSteps,
                totalResources,
                totalQuestions,
                recentUsers
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select('-progress').sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            data: users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role (promote/demote to admin)
// @access  Admin
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'دور غير صالح' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

        res.json({ success: true, message: 'تم تحديث دور المستخدم', data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'لا يمكنك حذف حسابك الخاص' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        res.json({ success: true, message: 'تم حذف المستخدم' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
});

module.exports = router;
