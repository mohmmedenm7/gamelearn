import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from './schemas/group.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { QuizAttempt, QuizAttemptSchema } from '../quizzes/schemas/quiz-attempt.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
            { name: User.name, schema: UserSchema },
            { name: QuizAttempt.name, schema: QuizAttemptSchema },
        ]),
    ],
    controllers: [GroupsController],
    providers: [GroupsService],
    exports: [GroupsService],
})
export class GroupsModule { }
