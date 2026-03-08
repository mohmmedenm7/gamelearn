import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubStageDocument = SubStage & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class SubStage {
    @Prop({ type: Types.ObjectId, ref: 'Level', required: true })
    level: Types.ObjectId;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true })
    concept: string; // The learning content / concept for this sub-stage

    @Prop({ required: true, min: 1 })
    order: number;

    @Prop({ default: 5, min: 1 })
    minQuestions: number; // how many quiz questions to serve from pool

    @Prop({ default: false })
    hasProject: boolean;

    @Prop({ default: true })
    isPublished: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const SubStageSchema = SchemaFactory.createForClass(SubStage);

// Unique order per level
SubStageSchema.index({ level: 1, order: 1 }, { unique: true });
