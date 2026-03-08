import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { LevelsModule } from './levels/levels.module';
import { SubstagesModule } from './substages/substages.module';
import { QuestionsModule } from './questions/questions.module';
import { ResourcesModule } from './resources/resources.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { GroupsModule } from './groups/groups.module';
import { ProjectsModule } from './projects/projects.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamelearn'),

    // Feature modules
    AuthModule,
    UsersModule,
    RoadmapsModule,
    LevelsModule,
    SubstagesModule,
    QuestionsModule,
    ResourcesModule,
    QuizzesModule,
    ProgressModule,
    GroupsModule,
    ProjectsModule,
    EmailModule,
  ],
})
export class AppModule { }
