# Google Analytics Setup Guide

This guide explains how to set up Google Analytics (GA4) for your Next.js application.

## 📋 Prerequisites

1. A Google account
2. Access to [Google Analytics](https://analytics.google.com/)

## 🚀 Setup Steps

### Step 1: Create a Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Start measuring"** or **"Admin"** → **"Create Property"**
3. Fill in your property details:
   - Property name: "Playwise Guru" (or your app name)
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
4. Click **"Next"** and complete the business information
5. Click **"Create"**

### Step 2: Get Your Measurement ID

1. After creating the property, you'll be prompted to create a **Data Stream**
2. Select **"Web"** as the platform
3. Enter your website URL (e.g., `https://yourdomain.com`)
4. Enter a stream name (e.g., "Playwise Guru Website")
5. Click **"Create stream"**
6. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
7. **Copy this Measurement ID** - you'll need it for the next step

### Step 3: Add Measurement ID to Environment Variables

Add the Measurement ID to your environment variables:

#### For Local Development

Create or update `.env.local` in the root directory:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HW4HZYZ5V7
```

**Note**: Replace `G-HW4HZYZ5V7` with your actual Measurement ID if different.

#### For Production (Render, Vercel, etc.)

1. Go to your hosting platform's environment variables section
2. Add a new variable:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-HW4HZYZ5V7` (your Measurement ID)
3. Save and redeploy your application

## ✅ Verification

After adding the environment variable:

1. **Restart your development server** (if running locally)
2. **Redeploy your application** (if in production)
3. Visit your website
4. Open Google Analytics → **Reports** → **Realtime**
5. You should see your visit appear in the realtime report

## 📊 Tracking Custom Events

The application includes utility functions for tracking custom events. Import and use them in your components:

```typescript
import { trackEvent, trackButtonClick, trackCasinoView, trackBonusClick } from '@/lib/utils/analytics';

// Track a button click
trackButtonClick('Play Now', 'Homepage');

// Track casino view
trackCasinoView('Casino Name');

// Track bonus click
trackBonusClick('Bonus Title', 'Casino Name');

// Track custom event
trackEvent('action', 'category', 'label', 123);
```

## 🎯 Available Tracking Functions

- `trackPageView(url)` - Track page views
- `trackEvent(action, category, label, value)` - Track custom events
- `trackButtonClick(buttonName, location)` - Track button clicks
- `trackFormSubmit(formName, success)` - Track form submissions
- `trackUserAction(action, details)` - Track user actions
- `trackCasinoView(casinoName)` - Track casino page views
- `trackBonusClick(bonusTitle, casinoName)` - Track bonus clicks
- `trackGamePlay(gameName)` - Track game plays

## 🔍 Testing

To verify tracking is working:

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Type: `window.dataLayer`
4. You should see an array with tracking data
5. Check **Network** tab for requests to `google-analytics.com`

## 📝 Notes

- The Google Analytics script only loads if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Page views are automatically tracked on route changes
- All tracking is client-side only (privacy-friendly)
- The script loads asynchronously to not block page rendering

## 🚨 Troubleshooting

**Issue: No data appearing in Google Analytics**

- Verify the Measurement ID is correct (starts with `G-`)
- Check that the environment variable is set correctly
- Ensure you've restarted/redeployed after adding the variable
- Check browser console for errors
- Verify the script is loading in the Network tab

**Issue: Script not loading**

- Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in your environment
- Verify the variable name is exactly `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Check browser console for JavaScript errors

