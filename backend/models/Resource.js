const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    step: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step',
        required: [true, 'الرابط بالخطوة مطلوب']
    },
    title: {
        type: String,
        required: [true, 'عنوان المصدر مطلوب'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'رابط المصدر مطلوب'],
        trim: true
    },
    type: {
        type: String,
        enum: ['video', 'article', 'course', 'book', 'other'],
        default: 'video'
    },
    platform: {
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

module.exports = mongoose.model('Resource', resourceSchema);
