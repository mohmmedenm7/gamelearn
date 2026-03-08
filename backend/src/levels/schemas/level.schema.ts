import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LevelDocument = Level & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Level {
    @Prop({ type: Types.ObjectId, ref: 'Roadmap', required: true })
    roadmap: Types.ObjectId;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, min: 1 })
    order: number;

    @Prop({ default: 0 })
    requiredPoints: number;

    @Prop({ default: '🎯' })
    icon: string;

    @Prop({ default: true })
    isPublished: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const LevelSchema = SchemaFactory.createForClass(Level);

// Unique order per roadmap
LevelSchema.index({ roadmap: 1, order: 1 }, { unique: true });
