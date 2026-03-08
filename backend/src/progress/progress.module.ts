import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { QuizAttempt, QuizAttemptSchema } from '../quizzes/schemas/quiz-attempt.schema';
import { Level, LevelSchema } from '../levels/schemas/level.schema';
import { SubStage, SubStageSchema } from '../substages/schemas/substage.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: QuizAttempt.name, schema: QuizAttemptSchema },
            { name: Level.name, schema: LevelSchema },
            { name: SubStage.name, schema: SubStageSchema },
        ]),
    ],
    controllers: [ProgressController],
    providers: [ProgressService],
    exports: [ProgressService],
})
export class ProgressModule { }
