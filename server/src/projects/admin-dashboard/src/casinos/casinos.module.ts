import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CasinosService } from './services/casinos.service';
import { CasinosController } from './controllers/casinos.controller';
import { Casino, CasinoSchema } from './schemas/casino.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Casino.name, schema: CasinoSchema }])],
  controllers: [CasinosController],
  providers: [CasinosService],
  exports: [CasinosService],
})
export class CasinosModule {}

