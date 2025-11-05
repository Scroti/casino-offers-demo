import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../data-access/dtos/create-user.dto';
import { LoginUserDto } from '../data-access/dtos/login-user.dto';
import { ForgotPasswordDto } from '../data-access/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../data-access/dtos/reset-password.dto';
import { VerifyEmailDto } from '../data-access/dtos/verify-email.dto';
import { ResendVerificationDto } from '../data-access/dtos/resend-verification.dto';
import { UpdateUserDto } from '../data-access/dtos/user-management.dto';
import { UserManagementService } from '../services/user-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userManagementService: UserManagementService,
  ) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req: Request) {
    // user is attached by JwtAuthGuard
    const user = req.user as any;
    // You may want to fetch fresh user fields from DB if needed for up-to-date data
    return this.authService.getUserProfile(user.id);
  }

  @Post('/refresh')
  async refresh(@Body() body: { refreshToken?: string }) {
    const refreshToken = body?.refreshToken;
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request) {
    const user = req.user as any;
    await this.authService.logout(user._id);
    return { message: 'Logged out successfully' };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('/resend-verification')
  async resendVerificationEmail(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user as any;
    // Allow users to update their own profile fields: name, profileImageUrl, gender, ageRange
    const allowedFields = ['name', 'profileImageUrl', 'gender', 'ageRange'];
    const filteredDto = Object.keys(updateUserDto)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateUserDto[key];
        return obj;
      }, {});
    
    return this.userManagementService.updateUser(user.id, filteredDto);
  }
}
