import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { GamesService } from '../services/games.service';
import { CreateGameDto } from '../dtos/create-game.dto';
import { UpdateGameDto } from '../dtos/update-game.dto';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.gamesService.findActive();
  }

  @Get('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async seed() {
    // This will be called from the frontend with game data
    return { message: 'Use POST /games/seed with game data in body' };
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async seedGames(@Body() games: CreateGameDto[]) {
    const result = await this.gamesService.seedGames(games);
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Get('gameId/:gameId')
  findByGameId(@Param('gameId') gameId: string) {
    return this.gamesService.findByGameId(gameId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Post(':id/increment-views')
  incrementViews(@Param('id') id: string) {
    return this.gamesService.incrementViews(id);
  }

  @Post(':id/increment-plays')
  incrementPlays(@Param('id') id: string) {
    return this.gamesService.incrementPlays(id);
  }
}

