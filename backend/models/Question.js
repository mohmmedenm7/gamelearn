const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    step: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step',
        required: [true, 'الرابط بالخطوة مطلوب']
    },
    question: {
        type: String,
        required: [true, 'نص السؤال مطلوب'],
        trim: true
    },
    options: {
        type: [String],
        required: [true, 'خيارات الإجابة مطلوبة'],
        validate: {
            validator: function (v) {
                return v.length >= 2 && v.length <= 6;
            },
            message: 'يجب أن يكون عدد الخيارات بين 2 و 6'
        }
    },
    correct: {
        type: Number,
        required: [true, 'رقم الإجابة الصحيحة مطلوب'],
        min: 0
    },
    explanation: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Validate correct index is within options range
questionSchema.pre('save', function (next) {
    if (this.correct >= this.options.length) {
        return next(new Error('رقم الإجابة الصحيحة أكبر من عدد الخيارات'));
    }
    next();
});

module.exports = mongoose.model('Question', questionSchema);
