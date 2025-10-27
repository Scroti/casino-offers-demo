import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../data-access/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../data-access/dtos/create-user.dto';
import { LoginUserDto } from '../data-access/dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { name, email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      passwordHash: hashedPassword,
    });
    const userId = user._id.toString();
    const userRole = user.role; // ✅ Get user role
    const tokens = await this.getTokens(userId, userRole); // ✅ Pass role
    await this.updateRefreshTokenHash(userId, tokens.refreshToken);

    return tokens;
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
      const payload = this.jwtService.verify(refreshToken);
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
    const accessToken = this.jwtService.sign(
      { id: userId, role }, // ✅ Include role in payload
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: userId, role }, // ✅ Include role in payload
      { expiresIn: '7d' },
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
}
