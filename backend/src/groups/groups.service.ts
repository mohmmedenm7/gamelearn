import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Group, GroupDocument } from './schemas/group.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { QuizAttempt, QuizAttemptDocument } from '../quizzes/schemas/quiz-attempt.schema';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(QuizAttempt.name) private quizAttemptModel: Model<QuizAttemptDocument>,
    ) { }

    /**
     * Create a new group
     */
    async createGroup(userId: string, data: { name: string; description?: string; roadmaps?: string[]; isPrivate?: boolean; color?: string; icon?: string }) {
        const inviteCode = uuidv4().slice(0, 8).toUpperCase();

        const group = await this.groupModel.create({
            ...data,
            creator: userId,
            members: [userId],
            inviteCode,
        });

        return {
            success: true,
            message: 'تم إنشاء المجموعة بنجاح',
            data: group,
        };
    }

    /**
     * Join group by invite code
     */
    async joinByCode(userId: string, inviteCode: string) {
        const group = await this.groupModel.findOne({ inviteCode: inviteCode.toUpperCase() });
        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        if (group.members.some((m) => m.toString() === userId)) {
            throw new BadRequestException('أنت بالفعل عضو في هذه المجموعة');
        }

        if (group.members.length >= group.maxMembers) {
            throw new BadRequestException('المجموعة ممتلئة');
        }

        group.members.push(Types.ObjectId.createFromHexString(userId));
        await group.save();

        return { success: true, message: 'تم الانضمام للمجموعة بنجاح', data: group };
    }

    /**
     * Join group by creator's username
     */
    async joinByUsername(userId: string, creatorUsername: string, groupId: string) {
        const creator = await this.userModel.findOne({ username: creatorUsername.toLowerCase() });
        if (!creator) throw new NotFoundException('المستخدم غير موجود');

        const group = await this.groupModel.findOne({ _id: groupId, creator: creator._id });
        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        if (group.members.some((m) => m.toString() === userId)) {
            throw new BadRequestException('أنت بالفعل عضو في هذه المجموعة');
        }

        if (group.members.length >= group.maxMembers) {
            throw new BadRequestException('المجموعة ممتلئة');
        }

        group.members.push(Types.ObjectId.createFromHexString(userId));
        await group.save();

        return { success: true, message: 'تم الانضمام للمجموعة بنجاح', data: group };
    }

    /**
     * Get user's groups
     */
    async getMyGroups(userId: string) {
        const groups = await this.groupModel
            .find({ members: userId })
            .populate('creator', 'name username avatar')
            .populate('roadmaps', 'title icon color')
            .sort({ createdAt: -1 });

        return { success: true, data: groups };
    }

    /**
     * Get group details with member progress
     */
    async getGroupDetails(groupId: string, userId: string) {
        const group = await this.groupModel
            .findById(groupId)
            .populate('creator', 'name username avatar points level')
            .populate('members', 'name username avatar points level')
            .populate('roadmaps', 'title icon color');

        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        // Check if user is a member
        if (!group.members.some((m: any) => m._id.toString() === userId)) {
            throw new ForbiddenException('أنت لست عضواً في هذه المجموعة');
        }

        // Get member progress for group's roadmaps
        const memberProgress = [];
        for (const member of group.members as any[]) {
            const totalPoints = await this.quizAttemptModel.aggregate([
                { $match: { user: member._id, passed: true } },
                { $group: { _id: null, total: { $sum: '$pointsEarned' } } },
            ]);

            memberProgress.push({
                user: {
                    id: member._id,
                    name: member.name,
                    username: member.username,
                    avatar: member.avatar,
                    points: member.points,
                    level: member.level,
                },
                groupPoints: totalPoints[0]?.total || 0,
            });
        }

        // Sort by group points
        memberProgress.sort((a, b) => b.groupPoints - a.groupPoints);

        return {
            success: true,
            data: {
                group,
                memberProgress,
            },
        };
    }

    /**
     * Leave a group
     */
    async leaveGroup(groupId: string, userId: string) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        if (group.creator.toString() === userId) {
            throw new BadRequestException('لا يمكن لمنشئ المجموعة مغادرتها. يمكنك حذفها بدلاً من ذلك');
        }

        group.members = group.members.filter((m) => m.toString() !== userId);
        await group.save();

        return { success: true, message: 'تم مغادرة المجموعة' };
    }

    /**
     * Delete a group (creator only)
     */
    async deleteGroup(groupId: string, userId: string) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        if (group.creator.toString() !== userId) {
            throw new ForbiddenException('فقط منشئ المجموعة يمكنه حذفها');
        }

        await this.groupModel.findByIdAndDelete(groupId);
        return { success: true, message: 'تم حذف المجموعة' };
    }

    /**
     * Update group (creator only)
     */
    async updateGroup(groupId: string, userId: string, data: Partial<Group>) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException('المجموعة غير موجودة');

        if (group.creator.toString() !== userId) {
            throw new ForbiddenException('فقط منشئ المجموعة يمكنه تعديلها');
        }

        const updated = await this.groupModel.findByIdAndUpdate(groupId, data, { new: true, runValidators: true });
        return { success: true, message: 'تم تحديث المجموعة', data: updated };
    }

    /**
     * Search public groups
     */
    async searchGroups(query: string) {
        const groups = await this.groupModel
            .find({
                isPrivate: false,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                ],
            })
            .populate('creator', 'name username avatar')
            .populate('roadmaps', 'title icon')
            .limit(20);

        return { success: true, data: groups };
    }
}
