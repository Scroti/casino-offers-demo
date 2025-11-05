import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './services/games.service';
import { GamesController } from './controllers/games.controller';
import { Game, GameSchema } from './schemas/game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}

