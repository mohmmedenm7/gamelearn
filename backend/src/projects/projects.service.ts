import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { ProjectSubmission, ProjectSubmissionDocument } from './schemas/project-submission.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(ProjectSubmission.name) private submissionModel: Model<ProjectSubmissionDocument>,
        private usersService: UsersService,
    ) { }

    // ═══════════════════════ Projects CRUD (Admin) ═══════════════════════

    async getProjectsForSubStage(subStageId: string) {
        const projects = await this.projectModel.find({ subStage: subStageId });
        return { success: true, data: projects };
    }

    async getProjectById(id: string) {
        const project = await this.projectModel.findById(id);
        if (!project) throw new NotFoundException('المشروع غير موجود');
        return { success: true, data: project };
    }

    async createProject(data: any, userId: string) {
        const project = await this.projectModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إنشاء المشروع', data: project };
    }

    async updateProject(id: string, data: any) {
        const project = await this.projectModel.findByIdAndUpdate(id, data, { new: true });
        if (!project) throw new NotFoundException('المشروع غير موجود');
        return { success: true, message: 'تم تحديث المشروع', data: project };
    }

    async deleteProject(id: string) {
        const project = await this.projectModel.findByIdAndDelete(id);
        if (!project) throw new NotFoundException('المشروع غير موجود');
        return { success: true, message: 'تم حذف المشروع' };
    }

    // ═══════════════════════ Submissions ═══════════════════════

    async submitProject(projectId: string, userId: string, data: { content: string; fileUrl?: string }) {
        const project = await this.projectModel.findById(projectId);
        if (!project) throw new NotFoundException('المشروع غير موجود');

        let status: string = 'pending';
        let grade = 0;
        let testResults: any[] = [];

        // Auto-grade if enabled (input/output matching)
        if (project.autoGrade && project.testCases.length > 0) {
            testResults = project.testCases.map((tc) => {
                // Simple output matching: trim and compare
                const actualOutput = data.content.trim();
                const passed = actualOutput.includes(tc.expectedOutput.trim());
                return {
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    actualOutput,
                    passed,
                };
            });

            const passedTests = testResults.filter((r) => r.passed).length;
            grade = Math.round((passedTests / testResults.length) * project.maxPoints);
            status = grade >= project.maxPoints * 0.6 ? 'passed' : 'failed';
        } else {
            status = 'needs_review'; // Manual grading needed
        }

        const submission = await this.submissionModel.create({
            user: userId,
            project: projectId,
            content: data.content,
            fileUrl: data.fileUrl || '',
            status,
            grade,
            testResults,
        });

        // Award points if auto-graded and passed
        if (status === 'passed') {
            await this.usersService.addPoints(userId, grade);
        }

        return { success: true, message: 'تم تسليم المشروع', data: submission };
    }

    async getMySubmissions(userId: string, projectId?: string) {
        const filter: any = { user: userId };
        if (projectId) filter.project = projectId;

        const submissions = await this.submissionModel
            .find(filter)
            .populate('project', 'title type autoGrade maxPoints')
            .sort({ createdAt: -1 });

        return { success: true, data: submissions };
    }

    // ═══════════════════════ Admin Grading ═══════════════════════

    async getPendingSubmissions() {
        const submissions = await this.submissionModel
            .find({ status: 'needs_review' })
            .populate('user', 'name username email')
            .populate('project', 'title type maxPoints')
            .sort({ createdAt: 1 });

        return { success: true, data: submissions };
    }

    async gradeSubmission(submissionId: string, adminId: string, data: { grade: number; feedback: string; status: 'passed' | 'failed' }) {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) throw new NotFoundException('التسليم غير موجود');

        submission.grade = data.grade;
        submission.feedback = data.feedback;
        submission.status = data.status;
        submission.gradedBy = require('mongoose').Types.ObjectId.createFromHexString(adminId);
        await submission.save();

        // Award points if passed
        if (data.status === 'passed') {
            await this.usersService.addPoints(submission.user.toString(), data.grade);
        }

        return { success: true, message: 'تم تقييم المشروع', data: submission };
    }
}
