import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';
import { Roadmap, RoadmapSchema } from './schemas/roadmap.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Roadmap.name, schema: RoadmapSchema }]),
    ],
    controllers: [RoadmapsController],
    providers: [RoadmapsService],
    exports: [RoadmapsService, MongooseModule],
})
export class RoadmapsModule { }
