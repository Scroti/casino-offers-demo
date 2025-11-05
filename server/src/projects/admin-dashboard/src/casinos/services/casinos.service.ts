import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Casino, CasinoDocument } from '../schemas/casino.schema';
import { CreateCasinoDto } from '../dtos/create-casino.dto';
import { UpdateCasinoDto } from '../dtos/update-casino.dto';

@Injectable()
export class CasinosService {
  constructor(
    @InjectModel(Casino.name) private casinoModel: Model<CasinoDocument>
  ) {}

  async create(dto: CreateCasinoDto): Promise<Casino> {
    return this.casinoModel.create(dto);
  }

  async findAll(): Promise<Casino[]> {
    return this.casinoModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Casino> {
    const casino = await this.casinoModel.findById(id).lean();
    if (!casino) throw new NotFoundException('Casino not found');
    return casino;
  }

  async update(id: string, dto: UpdateCasinoDto): Promise<Casino> {
    const casino = await this.casinoModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).lean();
    if (!casino) throw new NotFoundException('Casino not found');
    return casino;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.casinoModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Casino not found');
    return { deleted: true };
  }
}

