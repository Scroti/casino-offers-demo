# How to Enable Google Sheets Sync

The Google Sheets sync is **disabled by default** for security reasons. To enable it, you need to set the environment variable `GOOGLE_SHEETS_SYNC_ENABLED=true`.

## Quick Enable

### For Local Development

1. **Create or edit `.env` file** in the `server/` directory:

```bash
# In server/.env file
GOOGLE_SHEETS_SYNC_ENABLED=true
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Sheet1
```

2. **Restart your backend server** for the changes to take effect.

### For Production (Render, AWS, etc.)

1. **Add environment variable** in your hosting platform:
   - Variable name: `GOOGLE_SHEETS_SYNC_ENABLED`
   - Variable value: `true`

2. **Also ensure these are set:**
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME`

3. **Redeploy** your backend service.

## Why It's Disabled by Default

The sync is disabled by default because:
- It requires Google Cloud credentials
- It needs proper service account setup
- It's optional functionality
- It prevents accidental API calls if credentials are misconfigured

## Verification

After enabling, check your server logs. You should see:
- ✅ `Successfully updated Google Sheet with X subscribers` (when sync works)
- ❌ Error messages if there are configuration issues

If you see `"Google Sheets sync is disabled (GOOGLE_SHEETS_SYNC_ENABLED=false)"`, it means the variable is either:
- Not set (defaults to `false`)
- Explicitly set to `false`
- Set to something other than `true` (case-sensitive)

## Important Notes

- The value must be exactly `true` (lowercase, no quotes needed)
- Boolean values: `true` = enabled, `false` = disabled
- The variable is case-sensitive
- You must restart/redeploy after changing environment variables

