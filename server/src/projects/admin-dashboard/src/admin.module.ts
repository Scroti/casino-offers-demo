import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from 'offers/newsletter';
import { Module } from '@nestjs/common';
import { AdminNewsletterService } from './services/admin-newsletter.service';
import { NewsletterAdminController } from './controllers/admin-newsletter.controller';
import { BonusesModule } from './bonuses/bonuses.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CasinosModule } from './casinos/casinos.module';
import { ContactModule } from './contact/contact.module';
import { NewsModule } from './news/news.module';
import { GuidesModule } from './guides/guides.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    BonusesModule,
    CampaignsModule,
    CasinosModule,
    ContactModule,
    NewsModule,
    GuidesModule,
    GamesModule,
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
