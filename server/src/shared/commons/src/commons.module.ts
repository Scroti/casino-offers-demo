import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './services/google-sheets.service';
import { EmailService } from './services/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [GoogleSheetsService, EmailService],
  exports: [GoogleSheetsService, EmailService],
})
export class CommonsModule {}
