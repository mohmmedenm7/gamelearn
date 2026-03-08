import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class Avatar {
    @Prop({ default: 'default' })
    body: string;

    @Prop({ default: 'short' })
    hair: string;

    @Prop({ default: 'casual' })
    outfit: string;

    @Prop({ default: 'none' })
    accessory: string;

    @Prop({ default: '#6c5ce7' })
    color: string;

    @Prop({ default: '#f5cba7' })
    skinColor: string;

    @Prop({ default: '#2d3436' })
    hairColor: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true, maxlength: 50 })
    name: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 })
    username: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true, minlength: 6, select: false })
    password: string;

    @Prop({ enum: ['student', 'admin'], default: 'student' })
    role: string;

    @Prop({ type: AvatarSchema, default: () => ({}) })
    avatar: Avatar;

    @Prop({ default: 0 })
    points: number;

    @Prop({ default: 0 })
    weeklyPoints: number;

    @Prop({ default: 1 })
    level: number;

    @Prop({ default: 0 })
    streak: number;

    @Prop({ type: Date, default: null })
    lastActiveDate: Date;

    @Prop({ type: Object, default: {} })
    progress: Record<string, Record<string, boolean>>;

    // Compare password method
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};
