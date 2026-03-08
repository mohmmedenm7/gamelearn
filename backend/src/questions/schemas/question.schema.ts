import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
    @Prop({ type: Types.ObjectId, ref: 'SubStage', required: true })
    subStage: Types.ObjectId;

    @Prop({ required: true, trim: true })
    question: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ required: true, min: 0 })
    correct: number;

    @Prop({ trim: true })
    explanation: string;

    @Prop({ enum: ['easy', 'medium', 'hard'], default: 'medium' })
    difficulty: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Validate correct index within options range
QuestionSchema.pre('save', function (next) {
    if (this.correct >= this.options.length) {
        return next(new Error('رقم الإجابة الصحيحة أكبر من عدد الخيارات'));
    }
    next();
});
