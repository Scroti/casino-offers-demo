# Email Service Setup Guide

This guide will help you set up an email service to send verification and password reset emails.

## Overview

The application currently logs email verification links and codes to the console. To enable actual email sending, you need to integrate an email service provider.

## Recommended Email Services

### 1. **SendGrid** (Recommended for Production)
- **Free Tier**: 100 emails/day forever
- **Pros**: Reliable, good deliverability, easy to set up
- **Cons**: Can be expensive at scale

### 2. **Resend** (Developer-Friendly)
- **Free Tier**: 3,000 emails/month (100/day)
- **Pros**: Modern API, great developer experience, good documentation
- **Cons**: Newer service, less proven at scale

### 3. **AWS SES** (Cost-Effective)
- **Free Tier**: 62,000 emails/month (if on EC2)
- **Pros**: Very cheap, highly scalable, reliable
- **Cons**: More complex setup, requires AWS account

### 4. **Mailgun** (Good Alternative)
- **Free Tier**: 5,000 emails/month for 3 months, then 1,000/month
- **Pros**: Good API, decent free tier
- **Cons**: Free tier limited after trial

### 5. **SMTP with Nodemailer** (Generic)
- **Pros**: Works with any SMTP provider (Gmail, Outlook, etc.)
- **Cons**: Limited by provider's sending limits, less reliable

---

## Implementation Steps

### Step 1: Choose Your Email Service

For most projects, we recommend **Resend** or **SendGrid** for simplicity.

### Step 2: Install Required Packages

```bash
cd server
npm install nodemailer
# OR for SendGrid
npm install @sendgrid/mail
# OR for Resend
npm install resend
```

### Step 3: Create Email Service Module

Create a new file: `server/src/shared/commons/src/services/email.service.ts`

Here's an example implementation for **Resend** (recommended):

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
    verificationCode: string,
  ): Promise<void> {
    if (!this.resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com',
        to: email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
            <p>
              <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </p>
            <p>Or use this verification code:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center;">
              ${verificationCode}
            </p>
            <p style="color: #666; font-size: 12px;">
              This link will expire in 24 hours. The code will expire in 15 minutes.
            </p>
            <p style="color: #666; font-size: 12px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    if (!this.resend) {
      console.warn('Resend API key not configured. Email not sent.');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com',
        to: email,
        subject: 'Reset your password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p>
              <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }
}
```

**Alternative: SendGrid Implementation**

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
    verificationCode: string,
  ): Promise<void> {
    const msg = {
      to: email,
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com',
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <p>
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or use this verification code:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center;">
            ${verificationCode}
          </p>
          <p style="color: #666; font-size: 12px;">
            This link will expire in 24 hours. The code will expire in 15 minutes.
          </p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const msg = {
      to: email,
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com',
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">
            This link will expire in 1 hour.
          </p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }
}
```

### Step 4: Update Environment Variables

Add to `server/.env`:

**For Resend:**
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

**For SendGrid:**
```env
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

Update `server/src/config/validation.ts`:

```typescript
// Add these to the Joi schema
RESEND_API_KEY: Joi.string().optional(),
SENDGRID_API_KEY: Joi.string().optional(),
EMAIL_FROM: Joi.string().email().optional().default('noreply@yourdomain.com'),
```

### Step 5: Register Email Service

Update `server/src/shared/commons/src/commons.module.ts` (or create it if it doesn't exist):

```typescript
import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonsModule {}
```

Make sure `CommonsModule` is imported in your `AppModule`.

### Step 6: Update Auth Service

In `server/src/shared/auth/services/auth.service.ts`, inject and use the EmailService:

```typescript
// Add import
import { EmailService } from '@offers/commons';

// Inject in constructor
constructor(
  @InjectModel(User.name) private userModel: Model<UserDocument>,
  private jwtService: JwtService,
  private configService: ConfigService,
  private emailService: EmailService, // Add this
) {}

// Update generateVerificationTokens method
async generateVerificationTokens(userId: string): Promise<void> {
  // ... existing code to generate tokens ...

  const user = await this.userModel.findById(userId);
  if (user) {
    const verificationLink = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
    
    // Replace console.log with:
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationLink,
      verificationCode,
    );
  }
}

// Update forgotPassword method
async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
  // ... existing code ...

  // Replace console.log with:
  await this.emailService.sendPasswordResetEmail(user.email, resetLink);
  
  // ... rest of code ...
}

// Update resendVerificationEmail method similarly
```

### Step 7: Update AuthModule

Make sure `CommonsModule` is imported in `AuthModule` to have access to `EmailService`:

```typescript
import { Module } from '@nestjs/common';
import { CommonsModule } from '@offers/commons';

@Module({
  imports: [CommonsModule], // Add this
  // ... rest of module
})
export class AuthModule {}
```

---

## Quick Setup: Resend (Recommended)

1. **Sign up at [resend.com](https://resend.com)**
2. **Get your API key** from the dashboard
3. **Verify your domain** (or use their test domain for development)
4. **Install package:**
   ```bash
   cd server
   npm install resend
   ```
5. **Add to `.env`:**
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=onboarding@resend.dev  # For testing
   FRONTEND_URL=http://localhost:3000
   ```
6. **Follow Steps 3-7 above** using the Resend implementation

---

## Testing

After setup, test the email flow:

1. Sign up a new user
2. Check the email inbox for verification email
3. Click the verification link or use the code
4. Try logging in (should work after verification)

---

## Troubleshooting

### Emails not sending?
- Check API key is correct
- Verify domain is authenticated (for production)
- Check spam folder
- Review service provider logs/dashboard

### Getting rate limited?
- Use a service with higher limits
- Implement email queueing for production
- Cache email sending to prevent duplicates

### Development testing?
- Use console.log for local development
- Use Resend's test domain for development
- Use services like [Mailtrap](https://mailtrap.io) for testing

---

## Production Considerations

1. **Domain Verification**: Authenticate your sending domain
2. **SPF/DKIM Records**: Set up proper email authentication
3. **Rate Limiting**: Implement queues for high-volume sending
4. **Monitoring**: Set up alerts for email failures
5. **Templates**: Consider using HTML email templates
6. **Unsubscribe**: Include unsubscribe links for marketing emails

---

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **Nodemailer Docs**: https://nodemailer.com

