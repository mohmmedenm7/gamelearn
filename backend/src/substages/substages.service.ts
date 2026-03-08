import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubStage, SubStageDocument } from './schemas/substage.schema';

@Injectable()
export class SubstagesService {
    constructor(
        @InjectModel(SubStage.name) private subStageModel: Model<SubStageDocument>,
    ) { }

    async findByLevel(levelId: string) {
        const subStages = await this.subStageModel.find({ level: levelId, isPublished: true }).sort({ order: 1 });
        return { success: true, data: subStages };
    }

    async findById(id: string) {
        const subStage = await this.subStageModel.findById(id);
        if (!subStage) throw new NotFoundException('المرحلة الفرعية غير موجودة');
        return { success: true, data: subStage };
    }

    async create(data: Partial<SubStage>, userId: string) {
        const subStage = await this.subStageModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إنشاء المرحلة الفرعية', data: subStage };
    }

    async update(id: string, data: Partial<SubStage>) {
        const subStage = await this.subStageModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!subStage) throw new NotFoundException('المرحلة الفرعية غير موجودة');
        return { success: true, message: 'تم تحديث المرحلة الفرعية', data: subStage };
    }

    async delete(id: string) {
        const subStage = await this.subStageModel.findByIdAndDelete(id);
        if (!subStage) throw new NotFoundException('المرحلة الفرعية غير موجودة');
        return { success: true, message: 'تم حذف المرحلة الفرعية' };
    }
}
