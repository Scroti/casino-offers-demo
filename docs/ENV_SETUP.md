# Environment Variables Setup Guide

## Quick Fix for Google Analytics

If you're seeing "Google Analytics Not Configured" even after adding the environment variable, follow these steps:

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the **root directory** of your project (same level as `package.json`):

```bash
# In the root directory
touch .env.local
```

### Step 2: Add the Google Analytics Measurement ID

Open `.env.local` and add:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HW4HZYZ5V7
```

**Important:** 
- The variable name must be exactly `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- The value should be your measurement ID (e.g., `G-HW4HZYZ5V7`)
- No quotes needed around the value
- No spaces around the `=` sign

### Step 3: Restart Your Development Server

**This is critical!** Next.js reads environment variables at startup. You must:

1. **Stop** your current dev server (press `Ctrl+C` or `Cmd+C`)
2. **Start** it again with `npm run dev` or `yarn dev`

### Step 4: Clear Browser Cache

After restarting, refresh your browser page (or do a hard refresh with `Ctrl+Shift+R` or `Cmd+Shift+R`).

### Step 5: Verify

1. Go to `/admin` dashboard page
2. You should see the Google Analytics card with your Measurement ID
3. Check the console for: `GA Measurement ID from env: G-HW4HZYZ5V7`
4. The warning should disappear and you should see the "Open Google Analytics" button

## Common Issues

### Issue: Still seeing "Not Configured" after restart

**Solutions:**
1. Check that `.env.local` is in the root directory (not in `app/` or `server/`)
2. Verify the file name is exactly `.env.local` (not `.env.local.txt` or `.env`)
3. Make sure there are no typos in the variable name
4. Check that there's no trailing space after the value
5. Try restarting your terminal/IDE completely

### Issue: Variable not accessible in client components

**Solution:** 
- Variables must start with `NEXT_PUBLIC_` to be accessible in client components
- Server components can access any env var (without `NEXT_PUBLIC_` prefix)

### Issue: Working locally but not in production

**Solution:**
- For production (Render, Vercel, etc.), add the environment variable in your hosting platform's settings
- The variable name and value should be the same
- Redeploy after adding the variable

## File Structure

Your project structure should look like this:

```
casino-offers-demo/
├── .env.local          ← Create this file here
├── .gitignore         ← Should ignore .env.local
├── package.json
├── app/
├── components/
├── server/
└── ...
```

## Verification Checklist

- [ ] `.env.local` file exists in root directory
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HW4HZYZ5V7` is in `.env.local`
- [ ] Dev server was stopped and restarted
- [ ] Browser cache was cleared
- [ ] Debug info shows the measurement ID
- [ ] No typos in variable name

## Still Having Issues?

1. Check the browser console for any errors
2. Look at the Google Analytics card on the admin dashboard page
3. Verify the `.env.local` file is not being ignored by your editor
4. Try adding other `NEXT_PUBLIC_` variables to test if env vars work at all
5. Check Next.js documentation: https://nextjs.org/docs/basic-features/environment-variables

