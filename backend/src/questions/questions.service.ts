import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    ) { }

    async findBySubStage(subStageId: string) {
        const questions = await this.questionModel.find({ subStage: subStageId }).sort({ order: 1 });
        return { success: true, data: questions };
    }

    // Get random questions for a quiz (without correct answers for students)
    async getQuizQuestions(subStageId: string, count: number) {
        const questions = await this.questionModel.aggregate([
            { $match: { subStage: require('mongoose').Types.ObjectId.createFromHexString(subStageId) } },
            { $sample: { size: count } },
            { $project: { correct: 0, explanation: 0 } }, // Hide answers
        ]);
        return { success: true, data: questions };
    }

    // Get questions with answers (for grading)
    async getQuestionsWithAnswers(questionIds: string[]) {
        const objectIds = questionIds.map(id => require('mongoose').Types.ObjectId.createFromHexString(id));
        return this.questionModel.find({ _id: { $in: objectIds } });
    }

    async getQuestionCount(subStageId: string) {
        return this.questionModel.countDocuments({ subStage: subStageId });
    }

    async findById(id: string) {
        const question = await this.questionModel.findById(id);
        if (!question) throw new NotFoundException('السؤال غير موجود');
        return { success: true, data: question };
    }

    async create(data: any, userId: string) {
        const question = await this.questionModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إضافة السؤال', data: question };
    }

    async update(id: string, data: any) {
        const question = await this.questionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!question) throw new NotFoundException('السؤال غير موجود');
        return { success: true, message: 'تم تحديث السؤال', data: question };
    }

    async delete(id: string) {
        const question = await this.questionModel.findByIdAndDelete(id);
        if (!question) throw new NotFoundException('السؤال غير موجود');
        return { success: true, message: 'تم حذف السؤال' };
    }
}
