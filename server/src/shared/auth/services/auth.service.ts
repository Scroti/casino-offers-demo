import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../data-access/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../data-access/dtos/create-user.dto';
import { LoginUserDto } from '../data-access/dtos/login-user.dto';
import { ForgotPasswordDto } from '../data-access/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../data-access/dtos/reset-password.dto';
import { VerifyEmailDto } from '../data-access/dtos/verify-email.dto';
import { ResendVerificationDto } from '../data-access/dtos/resend-verification.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@offers/commons';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; requiresVerification: boolean }> {
    const { name, email, password, country, language } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      passwordHash: hashedPassword,
      country,
      language,
      isVerified: false, // Explicitly set to false - requires verification
    });
    const userId = user._id.toString();

    // Generate verification tokens on signup
    await this.generateVerificationTokens(userId);

    return {
      message: 'Account created successfully. Please verify your email to continue.',
      requiresVerification: true,
    };
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid email or password');

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in. Check your inbox for the verification link.');
    }

    const userId = user._id.toString();
    const userRole = user.role; // ✅ Get user role
    const tokens = await this.getTokens(userId, userRole); // ✅ Pass role
    await this.updateRefreshTokenHash(userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: null });
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret as any });
      const user = await this.userModel.findById(payload.id);
      if (!user || !user.refreshTokenHash) return null;

      const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isValid) return null;
      const userId = user._id.toString();
      const userRole = user.role; // ✅ Get user role
      const tokens = await this.getTokens(userId, userRole); // ✅ Pass role
      await this.updateRefreshTokenHash(userId, tokens.refreshToken);

      return tokens;
    } catch {
      return null;
    }
  }

  // ✅ Updated to accept and include role
  private async getTokens(
    userId: string,
    role: string, // ✅ Add role parameter
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessExpires = this.configService.get<string>('JWT_EXPIRES') || '15m';
    const refreshExpires = this.configService.get<string>('JWT_REFRESH_EXPIRES') || '7d';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET');

    const accessToken = await this.jwtService.signAsync(
      { id: userId, role },
      { expiresIn: accessExpires as any },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: userId, role },
      { expiresIn: refreshExpires as any, secret: refreshSecret },
    );
    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash });
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new UnauthorizedException('User not found');
    // Return only safe, public profile fields:
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role,
    };
  }

  // Generate a secure random token
  private generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate a 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = this.generateRandomToken();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

    // Save token to user
    await this.userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: resetToken,
      passwordResetTokenExpires: resetTokenExpires,
    });

    // Send email with reset link
    const resetLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetLink, user.name);

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await this.userModel.findByIdAndUpdate(user._id, {
      passwordHash: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });

    return { message: 'Password has been reset successfully.' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string; verified: boolean }> {
    const { token, code } = verifyEmailDto;

    if (!token && !code) {
      throw new BadRequestException('Either token or code must be provided.');
    }

    let user: UserDocument | null = null;

    if (token) {
      // Verify using token
      user = await this.userModel.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpires: { $gt: new Date() }, // Token not expired
      });
    } else if (code) {
      // Verify using 6-digit code
      user = await this.userModel.findOne({
        emailVerificationCode: code,
        emailVerificationCodeExpires: { $gt: new Date() }, // Code not expired
      });
    }

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token/code.');
    }

    // Mark email as verified and clear tokens
    await this.userModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
      emailVerificationCode: null,
      emailVerificationCodeExpires: null,
    });

    return { message: 'Email verified successfully.', verified: true };
  }

  async resendVerificationEmail(resendVerificationDto: ResendVerificationDto): Promise<{ message: string }> {
    const { email } = resendVerificationDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If an account exists with that email, a verification email has been sent.' };
    }

    if (user.isVerified) {
      return { message: 'Email is already verified.' };
    }

    // Generate new verification token and code
    const verificationToken = this.generateRandomToken();
    const verificationCode = this.generateVerificationCode();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours
    const codeExpires = new Date();
    codeExpires.setMinutes(codeExpires.getMinutes() + 15); // Code expires in 15 minutes

    // Save tokens to user
    await this.userModel.findByIdAndUpdate(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: tokenExpires,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpires: codeExpires,
    });

    // Send email with verification link and code
    const verificationLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
    await this.emailService.sendVerificationEmail(user.email, verificationLink, verificationCode, user.name);

    return { message: 'If an account exists with that email, a verification email has been sent.' };
  }

  // Generate verification token/code on signup
  async generateVerificationTokens(userId: string): Promise<void> {
    const verificationToken = this.generateRandomToken();
    const verificationCode = this.generateVerificationCode();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token expires in 24 hours
    const codeExpires = new Date();
    codeExpires.setMinutes(codeExpires.getMinutes() + 15); // Code expires in 15 minutes

    await this.userModel.findByIdAndUpdate(userId, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: tokenExpires,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpires: codeExpires,
    });

    // Send verification email
    const user = await this.userModel.findById(userId);
    if (user) {
      const verificationLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
      await this.emailService.sendVerificationEmail(user.email, verificationLink, verificationCode, user.name);
    }
  }
}
