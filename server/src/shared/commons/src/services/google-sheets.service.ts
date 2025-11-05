import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(private configService: ConfigService) {
    const serviceAccountEmail = this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = this.configService.get('GOOGLE_PRIVATE_KEY');
    
    if (!serviceAccountEmail || !privateKey) {
      console.warn('⚠️ Google Sheets credentials not configured. Google Sheets sync will be disabled.');
      console.warn('Required: GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY');
      return;
    }
    
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: serviceAccountEmail,
          private_key: privateKey?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
      
      if (!this.spreadsheetId) {
        console.warn('⚠️ GOOGLE_SHEETS_SPREADSHEET_ID is not set. Google Sheets sync will be disabled.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets service:', error);
      console.error('Error details:', error.message);
    }
  }

  async updateNewsletterSheet(subscribers: any[]) {
    const syncEnabled = this.configService.get<boolean>('GOOGLE_SHEETS_SYNC_ENABLED');
    if (!syncEnabled) {
      console.log('⚠️ Google Sheets sync is disabled. Set GOOGLE_SHEETS_SYNC_ENABLED=true to enable.');
      return;
    }
    
    // Validate required configuration
    if (!this.sheets) {
      console.error('Google Sheets sync failed: Google Sheets service not initialized (check credentials)');
      return;
    }
    
    if (!this.spreadsheetId) {
      console.error('Google Sheets sync failed: GOOGLE_SHEETS_SPREADSHEET_ID is not set');
      return;
    }
    
    const sheetName = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME');
    if (!sheetName) {
      console.error('Google Sheets sync failed: GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME is not set');
      return;
    }
    
    try {
      
      // Clear existing data
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:D`,
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
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(`✅ Successfully updated Google Sheet with ${subscribers.length} subscribers`);
    } catch (error) {
      console.error('❌ Error updating Google Sheet:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        spreadsheetId: this.spreadsheetId,
        sheetName: this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME'),
      });
      // Don't throw - we don't want to fail the main operation
    }
  }

  async appendSubscriber(subscriber: any) {
    const syncEnabled = this.configService.get<boolean>('GOOGLE_SHEETS_SYNC_ENABLED');
    if (!syncEnabled) {
      console.log('⚠️ Google Sheets sync is disabled. Set GOOGLE_SHEETS_SYNC_ENABLED=true to enable.');
      return;
    }
    
    if (!this.spreadsheetId) {
      console.error('Google Sheets sync failed: GOOGLE_SHEETS_SPREADSHEET_ID is not set');
      return;
    }
    
    const sheetName = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME');
    if (!sheetName) {
      console.error('Google Sheets sync failed: GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME is not set');
      return;
    }
    
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
        range: `${sheetName}!A:D`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(`✅ Successfully appended subscriber to Google Sheet: ${subscriber.email}`);
    } catch (error) {
      console.error('❌ Error appending to Google Sheet:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        spreadsheetId: this.spreadsheetId,
        sheetName: sheetName,
        subscriberEmail: subscriber.email,
      });
    }
  }
}
