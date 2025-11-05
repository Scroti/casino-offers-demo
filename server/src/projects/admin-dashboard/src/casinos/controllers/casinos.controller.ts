import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';
import { CasinosService } from '../services/casinos.service';
import { CreateCasinoDto } from '../dtos/create-casino.dto';
import { UpdateCasinoDto } from '../dtos/update-casino.dto';

@Controller('casinos')
export class CasinosController {
  constructor(private readonly casinosService: CasinosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCasinoDto) {
    return this.casinosService.create(dto);
  }

  @Get()
  findAll() {
    return this.casinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casinosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCasinoDto) {
    return this.casinosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.casinosService.remove(id);
  }
}

