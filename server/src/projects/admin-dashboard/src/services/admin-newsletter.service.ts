import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsletterSubscription, NewsletterSubscriptionDocument } from 'offers/newsletter'
@Injectable()
export class AdminNewsletterService {
  constructor(
    @InjectModel(NewsletterSubscription.name)
    private newsletterModel: Model<NewsletterSubscriptionDocument>,
  ) {}

  async getAllSubscribers(): Promise<NewsletterSubscription[]> {
    return this.newsletterModel.find().exec();
  }

  async getActiveSubscribers(): Promise<NewsletterSubscription[]> {
    return this.newsletterModel.find({ status: 'active' }).exec();
  }

}
