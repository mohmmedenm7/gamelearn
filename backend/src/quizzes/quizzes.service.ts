import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizAttempt, QuizAttemptDocument } from './schemas/quiz-attempt.schema';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';
import { SubStage, SubStageDocument } from '../substages/schemas/substage.schema';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(QuizAttempt.name) private quizAttemptModel: Model<QuizAttemptDocument>,
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
        @InjectModel(SubStage.name) private subStageModel: Model<SubStageDocument>,
        private usersService: UsersService,
        private emailService: EmailService,
    ) { }

    /**
     * Start a quiz: get random questions from the sub-stage pool
     */
    async startQuiz(subStageId: string, userId: string) {
        const subStage = await this.subStageModel.findById(subStageId);
        if (!subStage) throw new BadRequestException('المرحلة الفرعية غير موجودة');

        // Check if this is a retry (user has previous failed attempts)
        const previousAttempts = await this.quizAttemptModel
            .find({ user: userId, subStage: subStageId })
            .sort({ createdAt: -1 });

        const lastAttempt = previousAttempts[0];
        const isRetry = previousAttempts.length > 0;
        const mustRetry = lastAttempt && !lastAttempt.passed;

        // Get random questions, excluding previously served ones if retrying
        let excludeIds: Types.ObjectId[] = [];
        if (isRetry && lastAttempt) {
            excludeIds = lastAttempt.questionsServed;
        }

        // Try to get new questions, fallback to any if not enough
        let questions = await this.questionModel.aggregate([
            {
                $match: {
                    subStage: Types.ObjectId.createFromHexString(subStageId),
                    ...(excludeIds.length > 0 ? { _id: { $nin: excludeIds } } : {}),
                },
            },
            { $sample: { size: subStage.minQuestions } },
            { $project: { correct: 0, explanation: 0 } }, // Hide answers
        ]);

        // If not enough new questions, include previously used ones
        if (questions.length < subStage.minQuestions) {
            const remaining = subStage.minQuestions - questions.length;
            const existingIds = questions.map((q) => q._id);
            const moreQuestions = await this.questionModel.aggregate([
                {
                    $match: {
                        subStage: Types.ObjectId.createFromHexString(subStageId),
                        _id: { $nin: existingIds },
                    },
                },
                { $sample: { size: remaining } },
                { $project: { correct: 0, explanation: 0 } },
            ]);
            questions = [...questions, ...moreQuestions];
        }

        return {
            success: true,
            data: {
                questions,
                isRetry,
                mustRetry,
                totalQuestions: questions.length,
                subStage: {
                    id: subStage._id,
                    title: subStage.title,
                    minQuestions: subStage.minQuestions,
                },
            },
        };
    }

    /**
     * Submit quiz answers
     * Rules:
     * - >= 2 correct → passed, retry optional (for bonus points)
     * - < 2 correct → failed, must retry
     */
    async submitQuiz(
        subStageId: string,
        userId: string,
        data: { questionIds: string[]; answers: number[] },
    ) {
        const { questionIds, answers } = data;

        if (questionIds.length !== answers.length) {
            throw new BadRequestException('عدد الأسئلة لا يتطابق مع عدد الإجابات');
        }

        // Get questions with correct answers
        const objectIds = questionIds.map((id) => Types.ObjectId.createFromHexString(id));
        const questions = await this.questionModel.find({ _id: { $in: objectIds } });

        // Calculate score
        let score = 0;
        const results = questions.map((q, i) => {
            const questionIndex = questionIds.indexOf(q._id.toString());
            const userAnswer = answers[questionIndex];
            const isCorrect = userAnswer === q.correct;
            if (isCorrect) score++;
            return {
                questionId: q._id,
                question: q.question,
                userAnswer,
                correctAnswer: q.correct,
                isCorrect,
                explanation: q.explanation,
            };
        });

        const total = questions.length;
        const accuracy = Math.round((score / total) * 100);
        const passed = score >= 2; // Rule: >= 2 correct = pass

        // Check if this is a retry
        const previousAttempts = await this.quizAttemptModel.countDocuments({
            user: userId,
            subStage: subStageId,
        });
        const isRetry = previousAttempts > 0;

        // Calculate points
        let pointsEarned = 0;
        if (passed) {
            pointsEarned = score * 10; // 10 points per correct answer
            if (!isRetry) pointsEarned += 20; // Bonus for first-try pass
            if (accuracy === 100) pointsEarned += 30; // Perfect score bonus
        }

        // Save attempt
        const attempt = await this.quizAttemptModel.create({
            user: userId,
            subStage: subStageId,
            questionsServed: objectIds,
            answers,
            score,
            total,
            accuracy,
            passed,
            isRetry,
            pointsEarned,
        });

        // Add points to user if passed
        if (passed && pointsEarned > 0) {
            const { leveledUp } = await this.usersService.addPoints(userId, pointsEarned);

            // Send email on level up
            if (leveledUp) {
                try {
                    const user = await this.usersService.findById(userId);
                    await this.emailService.sendLevelUpEmail(user.email, user.name, user.level);
                } catch (e) {
                    console.log('Email sending skipped:', e.message);
                }
            }
        }

        return {
            success: true,
            data: {
                score,
                total,
                accuracy,
                passed,
                isRetry,
                pointsEarned,
                mustRetry: !passed,
                canRetryForBonus: passed,
                results,
            },
        };
    }

    /**
     * Get user's quiz history for a sub-stage
     */
    async getAttempts(subStageId: string, userId: string) {
        const attempts = await this.quizAttemptModel
            .find({ user: userId, subStage: subStageId })
            .sort({ createdAt: -1 });
        return { success: true, data: attempts };
    }

    /**
     * Check if user has passed a sub-stage
     */
    async hasPassedSubStage(subStageId: string, userId: string): Promise<boolean> {
        const passedAttempt = await this.quizAttemptModel.findOne({
            user: userId,
            subStage: subStageId,
            passed: true,
        });
        return !!passedAttempt;
    }
}
