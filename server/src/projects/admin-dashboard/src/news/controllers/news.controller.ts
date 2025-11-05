import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from '../services/news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('country') country?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    
    if (category) {
      return this.newsService.getNewsByCategory(category, limitNum, country);
    }
    
    return this.newsService.fetchNews(limitNum, country);
  }
}

