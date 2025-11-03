# Production Email Setup Guide

## 🚨 Important: Production Environment Issues

Many production platforms (like **Render**, **Railway**, **Heroku**, etc.) **block SMTP ports** (587, 465) for security reasons. This means Gmail SMTP will **NOT work** in production on these platforms.

## ✅ Solution: Use a Production Email Service

**👉 For detailed SendGrid setup, see: [SENDGRID_SETUP.md](./SENDGRID_SETUP.md)**

For production, you **MUST** use one of these email services:

### 1. **SendGrid** (Recommended)
- ✅ Works on all platforms (Render, Railway, Heroku, AWS, etc.)
- ✅ Free tier: 100 emails/day forever
- ✅ No port blocking issues
- ✅ Excellent deliverability

**Setup:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 2. **AWS SES** (Best for AWS)
- ✅ Very cheap ($0.10 per 1,000 emails)
- ✅ Works on all platforms
- ✅ Highly reliable

**Setup:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-smtp-username
SMTP_PASSWORD=your-aws-smtp-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 3. **Resend** (Modern & Developer-Friendly)
- ✅ Modern API
- ✅ Free tier: 3,000 emails/month
- ✅ Works on all platforms

**Setup:**
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 4. **Mailgun**
- ✅ Free tier: 5,000 emails/month (first 3 months), then 1,000/month
- ✅ Works on all platforms

**Setup:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-smtp-username
SMTP_PASSWORD=your-mailgun-smtp-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## 🔧 For Render Platform Specifically

Render **blocks outbound SMTP connections** to prevent spam. You have two options:

### Option 1: Use SendGrid (Easiest)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify your sender email
4. Add to Render environment variables:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_actual_api_key_here
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-render-url.onrender.com
```

### Option 2: Use Resend (Alternative)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add domain (or use their test domain)
4. Add to Render environment variables:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev  # For testing
FRONTEND_URL=https://your-render-url.onrender.com
```

## 🚫 Why Gmail SMTP Doesn't Work in Production

1. **Port Blocking**: Production platforms block ports 587 and 465
2. **IP Restrictions**: Gmail might block connections from cloud provider IPs
3. **Security Policies**: Many platforms disable outbound SMTP to prevent abuse
4. **Firewall Rules**: Production environments have strict firewall rules

## ✅ Quick Fix for Current Setup

If you're currently using Gmail and seeing timeout errors:

1. **Sign up for SendGrid** (fastest solution)
2. **Add SendGrid credentials to Render environment variables**
3. **Redeploy your application**

SendGrid setup takes ~5 minutes and works immediately.

## 📋 Environment Variables Checklist

Make sure these are set in your production environment (Render dashboard):

- ✅ `SMTP_HOST` - SMTP server hostname
- ✅ `SMTP_PORT` - SMTP port (usually 587)
- ✅ `SMTP_SECURE` - Set to `false` for port 587
- ✅ `SMTP_USER` - SMTP username
- ✅ `SMTP_PASSWORD` - SMTP password/API key
- ✅ `EMAIL_FROM` - Sender email address
- ✅ `FRONTEND_URL` - Your frontend URL (for email links)

## 🧪 Testing

After setting up:

1. Try signing up a new user
2. Check server logs for email sending status
3. Check your email inbox (and spam folder)
4. If emails don't arrive, check logs for connection errors

## 🆘 Troubleshooting

### Connection Timeout Error
- **Cause**: SMTP ports blocked or wrong SMTP host
- **Fix**: Use SendGrid, Resend, or AWS SES instead of Gmail

### Authentication Failed
- **Cause**: Wrong SMTP_USER or SMTP_PASSWORD
- **Fix**: Double-check credentials in environment variables

### Email Not Received
- **Check**: Server logs for errors
- **Check**: Spam folder
- **Verify**: Email service dashboard for delivery status

## 💡 Recommendation

For production, **SendGrid** is the easiest and most reliable option:
- Free tier is generous (100 emails/day)
- Works everywhere
- No port blocking issues
- Easy setup

Get started: https://sendgrid.com

