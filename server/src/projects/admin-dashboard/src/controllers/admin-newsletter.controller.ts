import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminNewsletterService } from '../services/admin-newsletter.service';

@Controller('admin/newsletter')
export class NewsletterAdminController {
  constructor(private readonly adminNewsletterService: AdminNewsletterService) {}

  @Get('all')
  async getAll() {
    return this.adminNewsletterService.getAllSubscribers();
  }

  
  @Get('/active')
  async getActiveSubscribers() {
    return this.adminNewsletterService.getActiveSubscribers();
  }
}
