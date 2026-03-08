import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizAttempt, QuizAttemptSchema } from './schemas/quiz-attempt.schema';
import { Question, QuestionSchema } from '../questions/schemas/question.schema';
import { SubStage, SubStageSchema } from '../substages/schemas/substage.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: QuizAttempt.name, schema: QuizAttemptSchema },
            { name: Question.name, schema: QuestionSchema },
            { name: SubStage.name, schema: SubStageSchema },
        ]),
        UsersModule,
        EmailModule,
    ],
    controllers: [QuizzesController],
    providers: [QuizzesService],
    exports: [QuizzesService],
})
export class QuizzesModule { }
