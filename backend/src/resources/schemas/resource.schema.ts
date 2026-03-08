import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResourceDocument = Resource & Document;

@Schema({ timestamps: true })
export class Resource {
    @Prop({ type: Types.ObjectId, ref: 'SubStage', required: true })
    subStage: Types.ObjectId;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, trim: true })
    url: string;

    @Prop({ enum: ['video', 'article', 'course', 'book', 'other'], default: 'video' })
    type: string;

    @Prop({ trim: true })
    platform: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
