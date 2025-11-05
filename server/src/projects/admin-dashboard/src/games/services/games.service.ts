import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { CreateGameDto } from '../dtos/create-game.dto';
import { UpdateGameDto } from '../dtos/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    // Check if gameId already exists
    const existingGame = await this.gameModel.findOne({ gameId: createGameDto.gameId });
    if (existingGame) {
      throw new ConflictException(`Game with ID "${createGameDto.gameId}" already exists`);
    }

    const game = new this.gameModel(createGameDto);
    return game.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().sort({ createdAt: -1 }).lean();
  }

  async findActive(): Promise<Game[]> {
    return this.gameModel.find({ isActive: true }).sort({ title: 1 }).lean();
  }

  async findOne(id: string): Promise<Game> {
    // Validate that id is a valid ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid game ID format');
    }
    const game = await this.gameModel.findById(id).lean();
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async findByGameId(gameId: string): Promise<Game | null> {
    return this.gameModel.findOne({ gameId }).lean();
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    // Validate that id is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid game ID format');
    }

    // If gameId is being updated, check for conflicts
    if (updateGameDto.gameId) {
      const existingGame = await this.gameModel.findOne({ 
        gameId: updateGameDto.gameId,
        _id: { $ne: id }
      });
      if (existingGame) {
        throw new ConflictException(`Game with ID "${updateGameDto.gameId}" already exists`);
      }
    }

    const updatedGame = await this.gameModel.findByIdAndUpdate(
      id,
      { ...updateGameDto, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updatedGame) {
      throw new NotFoundException('Game not found');
    }

    return updatedGame;
  }

  async remove(id: string): Promise<void> {
    // Validate that id is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid game ID format');
    }

    const result = await this.gameModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Game not found');
    }
  }

  async incrementViews(id: string): Promise<Game> {
    // Validate that id is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid game ID format');
    }

    const game = await this.gameModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  async incrementPlays(id: string): Promise<Game> {
    // Validate that id is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid game ID format');
    }

    const game = await this.gameModel.findByIdAndUpdate(
      id,
      { $inc: { plays: 1 } },
      { new: true }
    ).lean();

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  async seedGames(games: CreateGameDto[]): Promise<{ created: number; skipped: number }> {
    let created = 0;
    let skipped = 0;

    for (const gameDto of games) {
      const existing = await this.gameModel.findOne({ gameId: gameDto.gameId });
      if (!existing) {
        await this.gameModel.create(gameDto);
        created++;
      } else {
        skipped++;
      }
    }

    return { created, skipped };
  }
}

