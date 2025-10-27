import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonusesService } from '../services/bonuses.service';
import { CreateBonusDto } from '../dtos/create-bonus.dto';
import { UpdateBonusDto } from '../dtos/update-bonus.dto';

@Controller('bonuses')
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Post()
  create(@Body() dto: CreateBonusDto) {
    return this.bonusesService.create(dto);
  }

  @Get()
  findAll() {
    return this.bonusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonusesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBonusDto) {
    return this.bonusesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonusesService.remove(id);
  }
}
