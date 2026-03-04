const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Helper: generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register',
    [
        body('name').notEmpty().withMessage('الاسم مطلوب').trim(),
        body('email').isEmail().withMessage('بريد إلكتروني غير صالح').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    ],
    validate,
    async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'البريد الإلكتروني مسجل مسبقاً'
                });
            }

            const user = await User.create({ name, email, password });
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'تم إنشاء الحساب بنجاح',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
    [
        body('email').isEmail().withMessage('بريد إلكتروني غير صالح').normalizeEmail(),
        body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
    ],
    validate,
    async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'بريد إلكتروني أو كلمة مرور غير صحيحة'
                });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'بريد إلكتروني أو كلمة مرور غير صحيحة'
                });
            }

            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            progress: req.user.progress,
            createdAt: req.user.createdAt
        }
    });
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile (name only)
// @access  Private
router.put('/update-profile', protect,
    [body('name').notEmpty().withMessage('الاسم مطلوب').trim()],
    validate,
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { name: req.body.name },
                { new: true, runValidators: true }
            );
            res.json({ success: true, message: 'تم تحديث الملف الشخصي', user });
        } catch (err) {
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
);

module.exports = router;
