import { Controller, Post, Get, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CatService } from './cat.service';
import { Request } from 'express';

@Controller('cats')
export class CatController {
  private readonly logger = new Logger(CatController.name);

  constructor(private readonly catService: CatService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))  // Protect POST /cats
  async addCat(@Body() body: { name: string; age: number }, @Req() req: Request) {
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    return this.catService.addCat(body.name, body.age);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))  // Protect GET /cats
  async getCats(@Req() req: Request) {
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    return this.catService.getCats();
  }
}
