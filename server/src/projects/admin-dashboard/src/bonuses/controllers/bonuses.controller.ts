import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';
import { BonusesService } from '../services/bonuses.service';
import { CreateBonusDto } from '../dtos/create-bonus.dto';
import { UpdateBonusDto } from '../dtos/update-bonus.dto';

@Controller('bonuses')
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateBonusDto) {
    return this.bonusesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bonusesService.remove(id);
  }
}
