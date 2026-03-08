import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
    @Prop({ required: true, trim: true, maxlength: 100 })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    creator: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    members: Types.ObjectId[];

    @Prop({ required: true, unique: true })
    inviteCode: string;

    @Prop({ type: [Types.ObjectId], ref: 'Roadmap', default: [] })
    roadmaps: Types.ObjectId[];

    @Prop({ default: false })
    isPrivate: boolean;

    @Prop({ trim: true })
    description: string;

    @Prop({ default: '#6c5ce7' })
    color: string;

    @Prop({ default: '🎮' })
    icon: string;

    @Prop({ default: 50 })
    maxMembers: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

// Index for quick lookup by invite code
GroupSchema.index({ inviteCode: 1 });
