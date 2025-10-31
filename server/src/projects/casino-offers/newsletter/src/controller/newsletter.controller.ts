import { Body, Controller, Post, Get, NotFoundException } from '@nestjs/common';
import { SubscribeDto } from '../dtos/subscribe.dto';
import { NewsletterService } from '../service/newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('/subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    const subscription = await this.newsletterService.subscribe(dto.email);
    return { subscribed: true, subscription };
  }

  @Post('/unsubscribe')
  async unsubscribe(@Body() dto: SubscribeDto) {
    const subscription = await this.newsletterService.unsubscribe(dto.email);
    
    if (!subscription) {
      throw new NotFoundException('Email not found in newsletter list');
    }
    
    return { 
      unsubscribed: true, 
      message: 'Successfully unsubscribed from newsletter',
      subscription 
    };
  }

  @Post('/check')
  async check(@Body() dto: SubscribeDto) {
    const subscribed = await this.newsletterService.isSubscribed(dto.email);
    return { subscribed };
  }
}
