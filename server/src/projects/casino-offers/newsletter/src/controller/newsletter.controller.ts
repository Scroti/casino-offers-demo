import { Body, Controller, Post, Get, NotFoundException } from '@nestjs/common';
import { NewsletterService } from '../service/newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('/subscribe')
  async subscribe(@Body('email') email: string) {
    const subscription = await this.newsletterService.subscribe(email);
    return { subscribed: true, subscription };
  }

  @Post('/unsubscribe')
  async unsubscribe(@Body('email') email: string) {
    const subscription = await this.newsletterService.unsubscribe(email);
    
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
  async check(@Body('email') email: string) {
    const subscribed = await this.newsletterService.isSubscribed(email);
    return { subscribed };
  }
}
