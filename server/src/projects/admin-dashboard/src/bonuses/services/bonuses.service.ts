import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bonus, BonusDocument } from '../schemas/bonus.schema';
import { CreateBonusDto } from '../dtos/create-bonus.dto';
import { UpdateBonusDto } from '../dtos/update-bonus.dto';

@Injectable()
export class BonusesService {
  constructor(
    @InjectModel(Bonus.name) private bonusModel: Model<BonusDocument>
  ) {}

  async create(dto: CreateBonusDto): Promise<Bonus> {
    return this.bonusModel.create(dto);
  }

  async findAll(): Promise<Bonus[]> {
    return this.bonusModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Bonus> {
    const bonus = await this.bonusModel.findById(id).lean();
    if (!bonus) throw new NotFoundException('Bonus not found');
    return bonus;
  }

  async update(id: string, dto: UpdateBonusDto): Promise<Bonus> {
    const bonus = await this.bonusModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).lean();
    if (!bonus) throw new NotFoundException('Bonus not found');
    return bonus;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.bonusModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Bonus not found');
    return { deleted: true };
  }
}
