import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
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

  @Get('casino/:casinoId')
  findByCasino(@Param('casinoId') casinoId: string) {
    return this.bonusesService.findByCasino(casinoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Validate that id is a valid ObjectId format (24 hex characters)
    // This prevents route conflicts where "casino" could be mistaken for an ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid bonus ID format');
    }
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
