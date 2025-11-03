# Verify SendGrid Environment Variables in Render

## 🔍 Check Your Environment Variables

The connection timeout error suggests that either:
1. SendGrid environment variables aren't set correctly
2. SMTP_HOST is still pointing to Gmail instead of SendGrid
3. Render is blocking SMTP connections (less likely with SendGrid)

## ✅ Step-by-Step Verification

### 1. Check Render Dashboard

1. Go to your **Render Dashboard**
2. Select your **Backend Service**
3. Click on **"Environment"** tab
4. Verify you have **ALL** these variables:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
EMAIL_FROM=your-verified-email@gmail.com
FRONTEND_URL=https://your-frontend-url.com
```

### 2. Check Server Logs

After deployment, check your **Render logs** for the SMTP configuration:

Look for a line that says:
```
📧 SMTP Configuration: { host: '...', port: ..., user: '...', hasPassword: true/false, secure: true/false }
```

**What to look for:**
- ✅ `host: 'smtp.sendgrid.net'` (NOT `smtp.gmail.com`)
- ✅ `user: 'apikey'` (exactly "apikey", not an email)
- ✅ `hasPassword: true` (should be true if API key is set)
- ✅ `port: 587`
- ✅ `secure: false`

### 3. Common Issues

#### Issue: SMTP_HOST is still `smtp.gmail.com`
**Fix:** Make sure `SMTP_HOST=smtp.sendgrid.net` is set in Render

#### Issue: SMTP_USER is not "apikey"
**Fix:** Make sure `SMTP_USER=apikey` (exactly "apikey", lowercase, no quotes)

#### Issue: SMTP_PASSWORD is empty or wrong
**Fix:** Make sure the API key starts with `SG.` and is the full key

#### Issue: Environment variables not visible in logs
**Fix:** 
- Save environment variables in Render
- Redeploy/restart the service
- Check logs again

### 4. Test Connection Manually

If you want to test SendGrid connection manually, you can temporarily add this to your code:

```typescript
// Temporary test - remove after debugging
this.transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error);
  } else {
    console.log('✅ SMTP Connection Successful!');
  }
});
```

### 5. SendGrid Dashboard Check

1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Go to **Activity** → **Email Activity**
3. Check if any emails are being attempted to send
4. Look for error messages or blocked sends

## 🔧 Quick Fix Checklist

- [ ] `SMTP_HOST=smtp.sendgrid.net` (NOT gmail.com)
- [ ] `SMTP_USER=apikey` (exactly "apikey", lowercase)
- [ ] `SMTP_PASSWORD` starts with `SG.` (your full API key)
- [ ] `SMTP_PORT=587`
- [ ] `SMTP_SECURE=false`
- [ ] `EMAIL_FROM` matches your verified sender email
- [ ] All variables saved in Render
- [ ] Backend service restarted/redeployed
- [ ] Check server logs for SMTP configuration output

## 🆘 Still Having Issues?

If connection timeout persists:

1. **Check Render Logs** - Look for the `📧 SMTP Configuration:` log line
2. **Verify API Key** - Make sure it's correct in SendGrid dashboard
3. **Check SendGrid Status** - Visit https://status.sendgrid.com/
4. **Try Different Port** - Some providers block 587, try port 465 with `SMTP_SECURE=true`

## 📝 Note

Render typically allows SendGrid connections, but if you're still getting timeouts:
- Check if Render has any firewall rules for your service
- Consider using SendGrid's API directly instead of SMTP (more complex but more reliable)
- Or try a different email service like Resend which might work better

