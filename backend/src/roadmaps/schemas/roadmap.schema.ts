import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoadmapDocument = Roadmap & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Roadmap {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ trim: true })
    titleEn: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: '📚' })
    icon: string;

    @Prop({ default: '#6c5ce7' })
    color: string;

    @Prop({ default: '#a29bfe' })
    colorSecondary: string;

    @Prop({ default: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' })
    gradient: string;

    @Prop({ default: true })
    isPublished: boolean;

    @Prop({ default: 0 })
    order: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);
