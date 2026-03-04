const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان خارطة الطريق مطلوب'],
        trim: true
    },
    titleEn: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'وصف خارطة الطريق مطلوب']
    },
    icon: {
        type: String,
        default: '📚'
    },
    color: {
        type: String,
        default: '#6c5ce7'
    },
    colorSecondary: {
        type: String,
        default: '#a29bfe'
    },
    gradient: {
        type: String,
        default: 'linear-gradient(135deg, #6c5ce7, #a29bfe)'
    },
    isPublished: {
        type: Boolean,
        default: true
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: populate steps count
roadmapSchema.virtual('stepsCount', {
    ref: 'Step',
    localField: '_id',
    foreignField: 'roadmap',
    count: true
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
