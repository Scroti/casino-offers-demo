import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BonusesService } from './services/bonuses.service';
import { BonusesController } from './controllers/bonuses.controller';
import { Bonus, BonusSchema } from './schemas/bonus.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bonus.name, schema: BonusSchema }])],
  controllers: [BonusesController],
  providers: [BonusesService],
  exports: [BonusesService],
})
export class BonusesModule {}
