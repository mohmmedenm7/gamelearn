const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    roadmap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
        required: [true, 'الرابط بخارطة الطريق مطلوب']
    },
    title: {
        type: String,
        required: [true, 'عنوان الخطوة مطلوب'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'وصف الخطوة مطلوب']
    },
    order: {
        type: Number,
        required: [true, 'ترتيب الخطوة مطلوب'],
        min: 1
    },
    isPublished: {
        type: Boolean,
        default: true
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

// Compound index: unique order per roadmap
stepSchema.index({ roadmap: 1, order: 1 }, { unique: true });

// Virtuals
stepSchema.virtual('resources', {
    ref: 'Resource',
    localField: '_id',
    foreignField: 'step'
});

stepSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'step'
});

module.exports = mongoose.model('Step', stepSchema);
