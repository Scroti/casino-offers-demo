import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly appName = 'Playwise Guru';
  private readonly logoUrl: string;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    // Create transporter using SMTP configuration from environment variables
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true', // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.logoUrl = this.configService.get<string>('EMAIL_LOGO_URL') || `${this.frontendUrl}/assets/images/logo.png`;
  }

  private getEmailTemplate(header: string, content: string, footer?: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.appName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <img src="${this.logoUrl}" alt="${this.appName}" style="max-width: 120px; height: auto; margin-bottom: 10px;" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${this.appName}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    ${header}
                    ${content}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    ${footer || `
                      <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                        © ${new Date().getFullYear()} ${this.appName}. All rights reserved.
                      </p>
                      <p style="color: #6c757d; font-size: 12px; margin: 0;">
                        If you have any questions, please contact our support team.
                      </p>
                    `}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
    verificationCode: string,
    userName?: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>('EMAIL_FROM') || this.configService.get<string>('SMTP_USER');
    
    if (!fromEmail) {
      console.warn('SMTP not configured. Email not sent.');
      console.log(`Verification link for ${email}: ${verificationLink}`);
      console.log(`Verification code for ${email}: ${verificationCode}`);
      return;
    }

    const greeting = userName ? `Hi ${userName},` : 'Hi there,';
    const header = `
      <h2 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Verify Your Email Address</h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        ${greeting}
      </p>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        Thank you for signing up for ${this.appName}! We're excited to have you on board. To complete your registration and start using our platform, please verify your email address.
      </p>
    `;

    const content = `
      <div style="text-align: center; margin: 40px 0;">
        <a href="${verificationLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
          Verify Email Address
        </a>
      </div>
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
        <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">Or use this verification code:</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; color: #667eea; margin: 15px 0; font-family: 'Courier New', monospace;">
          ${verificationCode}
        </p>
        <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">Code expires in 15 minutes</p>
      </div>
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
          <strong>⏰ Important:</strong> This verification link will expire in 24 hours. For security reasons, please verify your email as soon as possible.
        </p>
      </div>
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you didn't create an account with ${this.appName}, you can safely ignore this email. No action is required.
      </p>
    `;

    try {
      await this.transporter.sendMail({
        from: `${this.appName} <${fromEmail}>`,
        to: email,
        subject: `Welcome to ${this.appName} - Verify your email`,
        html: this.getEmailTemplate(header, content),
      });
      console.log(`✅ Verification email sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Log the info for development purposes even if email fails
      console.log(`Verification link for ${email}: ${verificationLink}`);
      console.log(`Verification code for ${email}: ${verificationCode}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string, userName?: string): Promise<void> {
    const fromEmail = this.configService.get<string>('EMAIL_FROM') || this.configService.get<string>('SMTP_USER');
    
    if (!fromEmail) {
      console.warn('SMTP not configured. Email not sent.');
      console.log(`Password reset link for ${email}: ${resetLink}`);
      return;
    }

    const greeting = userName ? `Hi ${userName},` : 'Hi there,';
    const header = `
      <h2 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Reset Your Password</h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        ${greeting}
      </p>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        We received a request to reset your password for your ${this.appName} account. Click the button below to create a new password.
      </p>
    `;

    const content = `
      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetLink}" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);">
          Reset My Password
        </a>
      </div>
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
          <strong>⏰ Important:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and no action is needed.
      </p>
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        <strong>Security Tip:</strong> If you're concerned about the security of your account, please contact our support team immediately.
      </p>
    `;

    try {
      await this.transporter.sendMail({
        from: `${this.appName} <${fromEmail}>`,
        to: email,
        subject: `Reset your ${this.appName} password`,
        html: this.getEmailTemplate(header, content),
      });
      console.log(`✅ Password reset email sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      // Log the info for development purposes even if email fails
      console.log(`Password reset link for ${email}: ${resetLink}`);
      throw error;
    }
  }
}

