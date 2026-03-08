import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private levelModel: Model<LevelDocument>,
    ) { }

    async findByRoadmap(roadmapId: string) {
        const levels = await this.levelModel.find({ roadmap: roadmapId, isPublished: true }).sort({ order: 1 });
        return { success: true, data: levels };
    }

    async findById(id: string) {
        const level = await this.levelModel.findById(id);
        if (!level) throw new NotFoundException('المستوى غير موجود');
        return { success: true, data: level };
    }

    async create(data: Partial<Level>, userId: string) {
        const level = await this.levelModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إنشاء المستوى', data: level };
    }

    async update(id: string, data: Partial<Level>) {
        const level = await this.levelModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!level) throw new NotFoundException('المستوى غير موجود');
        return { success: true, message: 'تم تحديث المستوى', data: level };
    }

    async delete(id: string) {
        const level = await this.levelModel.findByIdAndDelete(id);
        if (!level) throw new NotFoundException('المستوى غير موجود');
        return { success: true, message: 'تم حذف المستوى' };
    }
}
