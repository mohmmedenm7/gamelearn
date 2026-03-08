import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findById(id: string) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) throw new NotFoundException('المستخدم غير موجود');
        return user;
    }

    async findByUsername(username: string) {
        const user = await this.userModel.findOne({ username: username.toLowerCase() }).select('-password');
        if (!user) throw new NotFoundException('المستخدم غير موجود');
        return user;
    }

    async updateProfile(userId: string, updateData: { name?: string; username?: string }) {
        if (updateData.username) {
            const existing = await this.userModel.findOne({
                username: updateData.username.toLowerCase(),
                _id: { $ne: userId },
            });
            if (existing) throw new BadRequestException('اسم المستخدم مسجل مسبقاً');
            updateData.username = updateData.username.toLowerCase();
        }

        const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');

        return { success: true, message: 'تم تحديث الملف الشخصي', user };
    }

    async updateAvatar(userId: string, avatar: any) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { avatar },
            { new: true, runValidators: true },
        ).select('-password');

        return { success: true, message: 'تم تحديث الشخصية', user };
    }

    async addPoints(userId: string, points: number) {
        const user = await this.userModel.findById(userId);
        user.points += points;
        user.weeklyPoints += points;

        // Level up every 500 points
        const newLevel = Math.floor(user.points / 500) + 1;
        const leveledUp = newLevel > user.level;
        user.level = newLevel;

        await user.save();
        return { user, leveledUp };
    }

    async getLeaderboard(limit = 50) {
        const users = await this.userModel
            .find({ role: 'student' })
            .select('name username avatar points level streak')
            .sort({ points: -1 })
            .limit(limit);

        return { success: true, data: users };
    }

    async getWeeklyLeaderboard(limit = 50) {
        const users = await this.userModel
            .find({ role: 'student' })
            .select('name username avatar weeklyPoints points level')
            .sort({ weeklyPoints: -1 })
            .limit(limit);

        return { success: true, data: users };
    }

    async resetWeeklyPoints() {
        await this.userModel.updateMany({}, { weeklyPoints: 0 });
        return { success: true, message: 'تم إعادة تعيين النقاط الأسبوعية' };
    }

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.userModel.countDocuments(),
        ]);

        return {
            success: true,
            data: users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
}
