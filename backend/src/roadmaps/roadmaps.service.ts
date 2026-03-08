import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roadmap, RoadmapDocument } from './schemas/roadmap.schema';

@Injectable()
export class RoadmapsService {
    constructor(
        @InjectModel(Roadmap.name) private roadmapModel: Model<RoadmapDocument>,
    ) { }

    async findAll(published = true) {
        const filter = published ? { isPublished: true } : {};
        const roadmaps = await this.roadmapModel.find(filter).sort({ order: 1 });
        return { success: true, data: roadmaps };
    }

    async findById(id: string) {
        const roadmap = await this.roadmapModel.findById(id);
        if (!roadmap) throw new NotFoundException('خارطة الطريق غير موجودة');
        return { success: true, data: roadmap };
    }

    async create(data: Partial<Roadmap>, userId: string) {
        const roadmap = await this.roadmapModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إنشاء خارطة الطريق', data: roadmap };
    }

    async update(id: string, data: Partial<Roadmap>) {
        const roadmap = await this.roadmapModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!roadmap) throw new NotFoundException('خارطة الطريق غير موجودة');
        return { success: true, message: 'تم تحديث خارطة الطريق', data: roadmap };
    }

    async delete(id: string) {
        const roadmap = await this.roadmapModel.findByIdAndDelete(id);
        if (!roadmap) throw new NotFoundException('خارطة الطريق غير موجودة');
        return { success: true, message: 'تم حذف خارطة الطريق' };
    }
}
