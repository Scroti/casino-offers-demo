import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { GuidesService } from '../services/guides.service';
import { CreateGuideDto } from '../dtos/create-guide.dto';
import { UpdateGuideDto } from '../dtos/update-guide.dto';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createGuideDto: CreateGuideDto) {
    return this.guidesService.create(createGuideDto);
  }

  @Get()
  findAll(@Query('published') published?: string) {
    const publishedOnly = published === 'true';
    return this.guidesService.findAll(publishedOnly);
  }

  @Get('featured')
  findFeatured() {
    return this.guidesService.findFeatured();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.guidesService.findByCategory(category);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.guidesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Validate that id is a valid ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new NotFoundException('Invalid guide ID format');
    }
    return this.guidesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guidesService.update(id, updateGuideDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.guidesService.remove(id);
  }

  @Post(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.guidesService.incrementViews(id);
  }
}

