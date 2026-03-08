import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubstagesService } from './substages.service';
import { SubstagesController } from './substages.controller';
import { SubStage, SubStageSchema } from './schemas/substage.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SubStage.name, schema: SubStageSchema }]),
    ],
    controllers: [SubstagesController],
    providers: [SubstagesService],
    exports: [SubstagesService, MongooseModule],
})
export class SubstagesModule { }
