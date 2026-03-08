import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectSubmissionDocument = ProjectSubmission & Document;

@Schema({ timestamps: true })
export class ProjectSubmission {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
    project: Types.ObjectId;

    @Prop({ required: true })
    content: string; // Code or submission text

    @Prop({ default: '' })
    fileUrl: string;

    @Prop({ enum: ['pending', 'passed', 'failed', 'needs_review'], default: 'pending' })
    status: string;

    @Prop({ default: 0 })
    grade: number;

    @Prop({ default: '' })
    feedback: string;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    gradedBy: Types.ObjectId;

    @Prop({ type: [Object], default: [] })
    testResults: { input: string; expectedOutput: string; actualOutput: string; passed: boolean }[];
}

export const ProjectSubmissionSchema = SchemaFactory.createForClass(ProjectSubmission);

// Index for querying user submissions
ProjectSubmissionSchema.index({ user: 1, project: 1 });
