import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        private_key: this.configService
          .get('GOOGLE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
  }

  async updateNewsletterSheet(subscribers: any[]) {
    try {
      // Clear existing data
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME')}!A:D`,
      });

      // Prepare data
      const values = [
        ['Email', 'Status', 'Subscribed At', 'ID'], // Headers
        ...subscribers.map((sub) => [
          sub.email,
          sub.status || 'active',
          sub.createdAt
            ? new Date(sub.createdAt)
                .toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(',', '')
            : '',
          sub._id.toString(),
        ]),
      ];

      // Update sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME')}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(
        `Updated Google Sheet with ${subscribers.length} subscribers`,
      );
    } catch (error) {
      console.error('Error updating Google Sheet:', error);
      throw error;
    }
  }

  async appendSubscriber(subscriber: any) {
    try {
      const values = [
        [
          subscriber.email,
          subscriber.status || 'active',
          subscriber.createdAt
            ? new Date(subscriber.createdAt).toISOString()
            : '',
          subscriber._id.toString(),
        ],
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME')}!A:D`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(`Appended subscriber to Google Sheet: ${subscriber.email}`);
    } catch (error) {
      console.error('Error appending to Google Sheet:', error);
    }
  }
}
