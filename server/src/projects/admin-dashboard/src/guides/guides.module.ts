import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesController } from './controllers/guides.controller';
import { GuidesService } from './services/guides.service';
import { Guide, GuideSchema } from './schemas/guide.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guide.name, schema: GuideSchema }]),
  ],
  controllers: [GuidesController],
  providers: [GuidesService],
  exports: [GuidesService],
})
export class GuidesModule {}

