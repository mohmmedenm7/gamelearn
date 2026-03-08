import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ timestamps: true })
export class QuizAttempt {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'SubStage', required: true })
    subStage: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: 'Question' })
    questionsServed: Types.ObjectId[];

    @Prop({ type: [Number] })
    answers: number[];

    @Prop({ required: true, min: 0 })
    score: number;

    @Prop({ required: true, min: 1 })
    total: number;

    @Prop({ required: true, min: 0, max: 100 })
    accuracy: number;

    @Prop({ required: true })
    passed: boolean;

    @Prop({ default: false })
    isRetry: boolean;

    @Prop({ default: 0 })
    pointsEarned: number;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

// Index for querying user attempts per sub-stage
QuizAttemptSchema.index({ user: 1, subStage: 1 });
