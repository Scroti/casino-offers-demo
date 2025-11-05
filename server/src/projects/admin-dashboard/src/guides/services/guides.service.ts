import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guide, GuideDocument } from '../schemas/guide.schema';
import { CreateGuideDto } from '../dtos/create-guide.dto';
import { UpdateGuideDto } from '../dtos/update-guide.dto';

@Injectable()
export class GuidesService {
  constructor(
    @InjectModel(Guide.name) private guideModel: Model<GuideDocument>,
  ) {}

  async create(createGuideDto: CreateGuideDto): Promise<Guide> {
    // Check if slug already exists
    const existingGuide = await this.guideModel.findOne({ slug: createGuideDto.slug });
    if (existingGuide) {
      throw new ConflictException('A guide with this slug already exists');
    }

    const guide = await this.guideModel.create({
      ...createGuideDto,
      publishedAt: createGuideDto.publishedAt ? new Date(createGuideDto.publishedAt) : new Date(),
    });

    return guide;
  }

  async findAll(publishedOnly: boolean = false): Promise<Guide[]> {
    const query = publishedOnly ? { isPublished: true } : {};
    return this.guideModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Guide> {
    const guide = await this.guideModel.findById(id).lean();
    if (!guide) {
      throw new NotFoundException('Guide not found');
    }
    return guide;
  }

  async findBySlug(slug: string): Promise<Guide> {
    const guide = await this.guideModel.findOne({ slug, isPublished: true }).lean();
    if (!guide) {
      throw new NotFoundException('Guide not found');
    }
    return guide;
  }

  async update(id: string, updateGuideDto: UpdateGuideDto): Promise<Guide> {
    // If slug is being updated, check for conflicts
    if (updateGuideDto.slug) {
      const existingGuide = await this.guideModel.findOne({ 
        slug: updateGuideDto.slug,
        _id: { $ne: id }
      });
      if (existingGuide) {
        throw new ConflictException('A guide with this slug already exists');
      }
    }

    const guide = await this.guideModel.findByIdAndUpdate(
      id,
      {
        ...updateGuideDto,
        publishedAt: updateGuideDto.publishedAt ? new Date(updateGuideDto.publishedAt) : undefined,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }

  async remove(id: string): Promise<void> {
    const result = await this.guideModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Guide not found');
    }
  }

  async incrementViews(id: string): Promise<void> {
    await this.guideModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async findByCategory(category: string): Promise<Guide[]> {
    return this.guideModel.find({ 
      categories: category,
      isPublished: true 
    }).sort({ createdAt: -1 }).lean();
  }

  async findFeatured(): Promise<Guide[]> {
    return this.guideModel.find({ 
      isFeatured: true,
      isPublished: true 
    }).sort({ createdAt: -1 }).lean();
  }
}

