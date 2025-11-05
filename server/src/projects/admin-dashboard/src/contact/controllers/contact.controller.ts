import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ContactService } from '../services/contact.service';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';
import { Request } from 'express';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() createContactDto: CreateContactDto, @Req() req: Request) {
    // Get user ID if authenticated (optional)
    const user = (req as any).user;
    const userId = user?.id;

    const contact = await this.contactService.createContact(createContactDto, userId);
    return {
      message: 'Your message has been received. We will get back to you soon!',
      id: contact._id.toString(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/resolve')
  async markAsResolved(@Param('id') id: string, @Body() body: { response?: string }) {
    return this.contactService.markAsResolved(id, body.response);
  }
}

