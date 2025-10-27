import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from 'offers/newsletter';
import { Module } from '@nestjs/common';
import { AdminNewsletterService } from './services/admin-newsletter.service';
import { NewsletterAdminController } from './controllers/admin-newsletter.controller';
import { BonusesModule } from './bonuses/bonuses.module';

@Module({
  imports: [
    BonusesModule,
    MongooseModule.forFeature([
      {
        name: NewsletterSubscription.name,
        schema: NewsletterSubscriptionSchema,
      },
    ]),
  ],
  controllers:[NewsletterAdminController],
  providers: [AdminNewsletterService],
  exports: [AdminNewsletterService],
})
export class AdminModule {}
