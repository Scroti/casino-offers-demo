# Nodemailer Setup Guide

This guide will help you configure Nodemailer to send verification and password reset emails.

## Quick Setup

### For Gmail (Recommended for Development)

1. **Enable App Passwords** (if you have 2FA enabled):
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

2. **Add to your `.env` file** in the `server` directory:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

### For Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
FRONTEND_URL=http://localhost:3000
```

### For Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@yahoo.com
FRONTEND_URL=http://localhost:3000
```

## Production Setup

For production, consider using a dedicated email service:

### Option 1: SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Option 2: AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-smtp-username
SMTP_PASSWORD=your-aws-smtp-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Option 3: Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-smtp-username
SMTP_PASSWORD=your-mailgun-smtp-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## Testing

1. Restart your server after adding environment variables
2. Sign up a new user
3. Check your email inbox for the verification email
4. Test password reset functionality

## Troubleshooting

### Emails not sending?

1. **Check SMTP credentials** - Make sure username and password are correct
2. **Check firewall** - Port 587 might be blocked
3. **Check spam folder** - Emails might be going to spam
4. **Gmail "Less secure app access"** - Use App Passwords instead
5. **Check server logs** - Look for error messages in console

### Common Errors

**"Invalid login"**:
- Verify SMTP_USER and SMTP_PASSWORD are correct
- For Gmail, use App Passwords if 2FA is enabled

**"Connection timeout"**:
- Check if SMTP_HOST and SMTP_PORT are correct
- Verify firewall settings

**"ECONNREFUSED"**:
- SMTP server is not reachable
- Check network connection

### Gmail Specific Notes

- **Regular password won't work** if 2FA is enabled
- You **must** use an App Password
- App Passwords can be generated in Google Account Settings → Security → App passwords
- If "Less secure app access" is enabled, regular password might work (not recommended)

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` | No (defaults to Gmail) |
| `SMTP_PORT` | SMTP server port | `587` | No (defaults to 587) |
| `SMTP_SECURE` | Use TLS/SSL | `false` | No (defaults to false) |
| `SMTP_USER` | SMTP username/email | `user@gmail.com` | Yes |
| `SMTP_PASSWORD` | SMTP password/app password | `your-password` | Yes |
| `EMAIL_FROM` | Sender email address | `noreply@yourdomain.com` | No (uses SMTP_USER) |
| `FRONTEND_URL` | Frontend URL for email links | `http://localhost:3000` | No (defaults to localhost) |

## Next Steps

After setup, the email service will automatically:
- Send verification emails on user signup
- Send password reset emails when requested
- Send verification code resend emails

All emails include both a clickable link and a verification code for flexibility.

