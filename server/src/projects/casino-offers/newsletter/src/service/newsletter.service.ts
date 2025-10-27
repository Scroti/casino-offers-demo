import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NewsletterSubscription,
  NewsletterSubscriptionDocument,
} from '../data-access/schemas/newsletter.schema';
import { GoogleSheetsService } from '@offers/commons';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(NewsletterSubscription.name)
    private newsletterModel: Model<NewsletterSubscriptionDocument>,
    private googleSheetsService: GoogleSheetsService,
  ) {}

  async subscribe(email: string): Promise<NewsletterSubscription> {
    const existing = await this.newsletterModel.findOne({ email });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        const updated = await existing.save();

        // Sync to Google Sheets
        await this.syncAllToGoogleSheets();

        return updated;
      }
      return existing;
    }

    const newSub = new this.newsletterModel({
      email,
      status: 'active',
    });

    const saved = await newSub.save();

    // Sync to Google Sheets
    await this.syncAllToGoogleSheets();

    return saved;
  }

  async unsubscribe(email: string): Promise<NewsletterSubscription | null> {
    const existing = await this.newsletterModel.findOne({ email });

    if (!existing) {
      return null;
    }

    existing.status = 'unsubscribed';
    const updated = await existing.save();

    // Sync to Google Sheets
    await this.syncAllToGoogleSheets();

    return updated;
  }

  async isSubscribed(email: string): Promise<boolean> {
    const existing = await this.newsletterModel.findOne({
      email,
      status: 'active',
    });
    return !!existing;
  }

  async getAllSubscribers(): Promise<NewsletterSubscription[]> {
    return this.newsletterModel.find().exec();
  }

  async getActiveSubscribers(): Promise<NewsletterSubscription[]> {
    return this.newsletterModel.find({ status: 'active' }).exec();
  }

  // Helper method to sync all subscribers to Google Sheets
  private async syncAllToGoogleSheets() {
    try {
      const allSubscribers = await this.getAllSubscribers();
      await this.googleSheetsService.updateNewsletterSheet(allSubscribers);
    } catch (error) {
      console.error('Failed to sync to Google Sheets:', error);
      // Don't throw - we don't want to fail the main operation
    }
  }
}
