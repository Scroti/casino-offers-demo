import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cat.schema';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async addCat(name: string, age: number): Promise<Cat> {
    const createdCat = new this.catModel({ name, age });
    return createdCat.save();
  }

  async getCats(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
