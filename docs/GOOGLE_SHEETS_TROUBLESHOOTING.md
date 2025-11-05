# Google Sheets Sync Troubleshooting Guide

If your Google Sheets is not updating anymore, follow these troubleshooting steps:

## Quick Checks

### 1. Check if Sync is Enabled

The sync only works if `GOOGLE_SHEETS_SYNC_ENABLED=true` is set in your environment variables.

**Check:** Look at your server logs for:
- `GOOGLE_SHEETS_SYNC_ENABLED` is not set or is `false`
- The sync will be silently skipped if disabled

### 2. Verify Environment Variables

Make sure all required environment variables are set:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Sheet1
GOOGLE_SHEETS_SYNC_ENABLED=true
```

**Important Notes:**
- `GOOGLE_PRIVATE_KEY` should include `\n` characters (newlines) - they will be converted automatically
- The private key should be the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- `GOOGLE_SHEETS_SPREADSHEET_ID` is the ID from the Google Sheets URL (the long string between `/d/` and `/edit`)
- `GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME` should match the exact name of the sheet tab (default is usually "Sheet1")

### 3. Check Service Account Permissions

The Google Sheet must be shared with your service account email.

**Steps:**
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
4. Give it "Editor" permissions
5. Make sure "Notify people" is unchecked (optional)

**Verify:**
- Service account email format: `xxxxx@xxxxx.iam.gserviceaccount.com`
- The email in the share dialog should match exactly

### 4. Check Service Account Credentials

Your service account credentials might have expired or been revoked.

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Find your service account
4. Click on it → **Keys** tab
5. Verify the key exists and is not expired
6. If expired, create a new key and update `GOOGLE_PRIVATE_KEY`

### 5. Check API Enablement

The Google Sheets API must be enabled in your Google Cloud project.

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Enabled APIs**
3. Search for "Google Sheets API"
4. Make sure it's enabled

If not enabled:
1. Go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click "Enable"

### 6. Check Server Logs

Look for errors in your server logs when a newsletter subscription happens:

**Expected logs:**
- `Updated Google Sheet with count=X` (success)
- `Appended subscriber to Google Sheet` (success for append)

**Error logs:**
- `Error updating Google Sheet: [error details]`
- `Failed to sync to Google Sheets: [error details]`

### 7. Test the Connection

You can test if the Google Sheets API is working by checking:

1. **Spreadsheet ID format:**
   - Should be a long string like: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
   - Found in the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

2. **Sheet Name:**
   - Should match the exact tab name (case-sensitive)
   - Default names: "Sheet1", "Sheet2", etc.
   - Custom names: whatever you named the tab

### 8. Common Issues

#### Issue: "The caller does not have permission"
**Solution:** Share the Google Sheet with the service account email

#### Issue: "Requested entity was not found"
**Solution:** 
- Check that `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
- Check that `GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME` matches the tab name exactly

#### Issue: "Invalid credentials"
**Solution:**
- Check that `GOOGLE_PRIVATE_KEY` is correctly formatted
- Verify the service account key is valid
- Make sure `GOOGLE_SERVICE_ACCOUNT_EMAIL` matches the key

#### Issue: "API not enabled"
**Solution:** Enable Google Sheets API in Google Cloud Console

#### Issue: Sync is enabled but nothing happens
**Solution:**
- Check server logs for errors
- Verify all environment variables are set correctly
- Make sure the newsletter service is being called

## Environment Variable Setup

### For Local Development (.env file)

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Sheet1
GOOGLE_SHEETS_SYNC_ENABLED=true
```

### For Production (Render/AWS/etc.)

Add these environment variables in your hosting platform's settings with the same names and values.

## Testing

To test if the sync is working:

1. Subscribe to the newsletter (new subscription)
2. Check server logs for: `Updated Google Sheet with count=X`
3. Open your Google Sheet
4. Verify the new subscriber appears in the sheet

## Still Not Working?

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the service account credentials manually using Google Sheets API
4. Make sure the Google Sheet is shared with the service account
5. Verify the Google Sheets API is enabled in your Google Cloud project

