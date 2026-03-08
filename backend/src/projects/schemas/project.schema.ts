import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class TestCase {
    @Prop({ required: true })
    input: string;

    @Prop({ required: true })
    expectedOutput: string;
}

export const TestCaseSchema = SchemaFactory.createForClass(TestCase);

@Schema({ timestamps: true })
export class Project {
    @Prop({ type: Types.ObjectId, ref: 'SubStage', required: true })
    subStage: Types.ObjectId;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ enum: ['code', 'design', 'essay', 'other'], default: 'code' })
    type: string;

    @Prop({ default: false })
    autoGrade: boolean;

    @Prop({ type: [TestCaseSchema], default: [] })
    testCases: TestCase[];

    @Prop({ default: 100 })
    maxPoints: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
