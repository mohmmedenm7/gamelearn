import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizAttempt, QuizAttemptDocument } from '../quizzes/schemas/quiz-attempt.schema';
import { Level, LevelDocument } from '../levels/schemas/level.schema';
import { SubStage, SubStageDocument } from '../substages/schemas/substage.schema';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(QuizAttempt.name) private quizAttemptModel: Model<QuizAttemptDocument>,
        @InjectModel(Level.name) private levelModel: Model<LevelDocument>,
        @InjectModel(SubStage.name) private subStageModel: Model<SubStageDocument>,
    ) { }

    /**
     * Get detailed progress for a user across all roadmaps
     */
    async getUserProgress(userId: string) {
        // Get all passed quiz attempts
        const passedAttempts = await this.quizAttemptModel
            .find({ user: userId, passed: true })
            .populate({
                path: 'subStage',
                populate: { path: 'level', populate: { path: 'roadmap' } },
            })
            .sort({ createdAt: -1 });

        // Group by roadmap → level → substage
        const progressMap: Record<string, any> = {};

        for (const attempt of passedAttempts) {
            const subStage = attempt.subStage as any;
            if (!subStage || !subStage.level) continue;
            const level = subStage.level;
            if (!level.roadmap) continue;
            const roadmap = level.roadmap;

            const roadmapId = roadmap._id.toString();
            if (!progressMap[roadmapId]) {
                progressMap[roadmapId] = {
                    roadmap: { id: roadmap._id, title: roadmap.title, icon: roadmap.icon },
                    levels: {},
                    totalPassed: 0,
                };
            }

            const levelId = level._id.toString();
            if (!progressMap[roadmapId].levels[levelId]) {
                progressMap[roadmapId].levels[levelId] = {
                    level: { id: level._id, title: level.title, order: level.order },
                    passedSubStages: [],
                };
            }

            const alreadyAdded = progressMap[roadmapId].levels[levelId].passedSubStages
                .some((s: any) => s.id === subStage._id.toString());

            if (!alreadyAdded) {
                progressMap[roadmapId].levels[levelId].passedSubStages.push({
                    id: subStage._id,
                    title: subStage.title,
                    bestScore: attempt.score,
                    accuracy: attempt.accuracy,
                });
                progressMap[roadmapId].totalPassed++;
            }
        }

        return { success: true, data: progressMap };
    }

    /**
     * Get progress percentage for a specific roadmap
     */
    async getRoadmapProgress(userId: string, roadmapId: string) {
        // Get all levels for this roadmap
        const levels = await this.levelModel.find({ roadmap: roadmapId });
        const levelIds = levels.map((l) => l._id);

        // Get all sub-stages for these levels
        const totalSubStages = await this.subStageModel.countDocuments({ level: { $in: levelIds } });
        if (totalSubStages === 0) return { success: true, data: { percentage: 0, completed: 0, total: 0 } };

        // Get passed sub-stages
        const subStages = await this.subStageModel.find({ level: { $in: levelIds } });
        const subStageIds = subStages.map((s) => s._id);

        const passedCount = await this.quizAttemptModel
            .distinct('subStage', {
                user: userId,
                subStage: { $in: subStageIds },
                passed: true,
            });

        const percentage = Math.round((passedCount.length / totalSubStages) * 100);

        return {
            success: true,
            data: {
                percentage,
                completed: passedCount.length,
                total: totalSubStages,
            },
        };
    }

    /**
     * Get user stats summary
     */
    async getUserStats(userId: string) {
        const totalAttempts = await this.quizAttemptModel.countDocuments({ user: userId });
        const passedAttempts = await this.quizAttemptModel.countDocuments({ user: userId, passed: true });
        const totalPoints = await this.quizAttemptModel.aggregate([
            { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
            { $group: { _id: null, total: { $sum: '$pointsEarned' } } },
        ]);

        const avgAccuracy = await this.quizAttemptModel.aggregate([
            { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
            { $group: { _id: null, avg: { $avg: '$accuracy' } } },
        ]);

        return {
            success: true,
            data: {
                totalAttempts,
                passedAttempts,
                failedAttempts: totalAttempts - passedAttempts,
                totalPoints: totalPoints[0]?.total || 0,
                averageAccuracy: Math.round(avgAccuracy[0]?.avg || 0),
            },
        };
    }
}
