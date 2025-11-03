import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../schemas/campaign.schema';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    // Check if token already exists
    const existing = await this.campaignModel.findOne({ token: dto.token });
    if (existing) {
      throw new Error(`Campaign with token "${dto.token}" already exists`);
    }
    return this.campaignModel.create(dto);
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).lean();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async findByToken(token: string): Promise<Campaign | null> {
    const campaign = await this.campaignModel.findOne({ token }).lean();
    if (!campaign) return null;

    // Check if campaign is active
    if (!campaign.isActive) return null;

    // Check expiration date if exists
    if (campaign.expiresAt) {
      const now = new Date();
      if (now > campaign.expiresAt) return null;
    }

    // Check start date if exists
    if (campaign.startsAt) {
      const now = new Date();
      if (now < campaign.startsAt) return null;
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).lean();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.campaignModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Campaign not found');
    return { deleted: true };
  }

  async incrementClickCount(token: string): Promise<void> {
    await this.campaignModel.updateOne(
      { token },
      { $inc: { clickCount: 1 } }
    );
  }

  async incrementBonusAccessCount(token: string): Promise<void> {
    await this.campaignModel.updateOne(
      { token },
      { $inc: { bonusAccessCount: 1 } }
    );
  }
}

