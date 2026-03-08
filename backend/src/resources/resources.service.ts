import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource, ResourceDocument } from './schemas/resource.schema';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,
    ) { }

    async findBySubStage(subStageId: string) {
        const resources = await this.resourceModel.find({ subStage: subStageId }).sort({ order: 1 });
        return { success: true, data: resources };
    }

    async findById(id: string) {
        const resource = await this.resourceModel.findById(id);
        if (!resource) throw new NotFoundException('المصدر غير موجود');
        return { success: true, data: resource };
    }

    async create(data: any, userId: string) {
        const resource = await this.resourceModel.create({ ...data, createdBy: userId });
        return { success: true, message: 'تم إضافة المصدر', data: resource };
    }

    async update(id: string, data: any) {
        const resource = await this.resourceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!resource) throw new NotFoundException('المصدر غير موجود');
        return { success: true, message: 'تم تحديث المصدر', data: resource };
    }

    async delete(id: string) {
        const resource = await this.resourceModel.findByIdAndDelete(id);
        if (!resource) throw new NotFoundException('المصدر غير موجود');
        return { success: true, message: 'تم حذف المصدر' };
    }
}
