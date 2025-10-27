import { CommonsModule, GoogleSheetsService } from '@offers/commons';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from './data-access/schemas/newsletter.schema';
import { NewsletterService } from './service/newsletter.service';
import { NewsletterController } from './controller/newsletter.controller';

@Module({
  imports: [
    CommonsModule,
    MongooseModule.forFeature([
      {
        name: NewsletterSubscription.name,
        schema: NewsletterSubscriptionSchema,
      },
    ]),
  ],
  providers: [NewsletterService],
  controllers: [NewsletterController],
  exports: [NewsletterService],
})
export class NewsletterModule {}
