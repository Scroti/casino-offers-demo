import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles, Role } from '@offers/auth';
import { AdminNewsletterService } from '../services/admin-newsletter.service';

@Controller('admin/newsletter')
export class NewsletterAdminController {
  constructor(private readonly adminNewsletterService: AdminNewsletterService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAll() {
    return this.adminNewsletterService.getAllSubscribers();
  }

  
  @Get('/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getActiveSubscribers() {
    return this.adminNewsletterService.getActiveSubscribers();
  }
}
