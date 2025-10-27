import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatus } from '../data-access/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangeUserStatusDto,
  ChangeUserRoleDto,
  SendEmailDto,
  BulkDeleteUsersDto,
  BulkChangeStatusDto,
} from '../data-access/dtos/user-management.dto';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-passwordHash -refreshTokenHash').lean();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-passwordHash -refreshTokenHash').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role } = createUserDto;

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
      role: role || 'user',
      status: UserStatus.ACTIVE,
    });

    return this.userModel.findById(user._id).select('-passwordHash -refreshTokenHash').lean();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
      if (existingUser) {
        throw new BadRequestException('Email already taken');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash -refreshTokenHash').lean();

    return updatedUser;
  }

  async deleteUser(id: string): Promise<{ deleted: boolean }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(id);
    return { deleted: true };
  }

  async changeUserStatus(id: string, changeStatusDto: ChangeUserStatusDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { status: changeStatusDto.status, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash -refreshTokenHash').lean();

    return updatedUser;
  }

  async changeUserRole(id: string, changeRoleDto: ChangeUserRoleDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { role: changeRoleDto.role, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash -refreshTokenHash').lean();

    return updatedUser;
  }

  async sendEmailToUser(id: string, sendEmailDto: SendEmailDto): Promise<{ sent: boolean }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll just log the email details
    console.log(`Sending email to ${user.email}:`, {
      subject: sendEmailDto.subject,
      message: sendEmailDto.message,
    });

    // TODO: Implement actual email sending logic
    // await this.emailService.sendEmail(user.email, sendEmailDto.subject, sendEmailDto.message);

    return { sent: true };
  }

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto): Promise<{ deleted: number }> {
    const result = await this.userModel.deleteMany({
      _id: { $in: bulkDeleteDto.userIds }
    });

    return { deleted: result.deletedCount };
  }

  async bulkChangeStatus(bulkChangeStatusDto: BulkChangeStatusDto): Promise<{ updated: number }> {
    const result = await this.userModel.updateMany(
      { _id: { $in: bulkChangeStatusDto.userIds } },
      { 
        status: bulkChangeStatusDto.status,
        updatedAt: new Date()
      }
    );

    return { updated: result.modifiedCount };
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    bannedUsers: number;
    pendingUsers: number;
    totalRevenue: number;
  }> {
    const stats = await this.userModel.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', UserStatus.ACTIVE] }, 1, 0] }
          },
          inactiveUsers: {
            $sum: { $cond: [{ $eq: ['$status', UserStatus.INACTIVE] }, 1, 0] }
          },
          bannedUsers: {
            $sum: { $cond: [{ $eq: ['$status', UserStatus.BANNED] }, 1, 0] }
          },
          pendingUsers: {
            $sum: { $cond: [{ $eq: ['$status', UserStatus.PENDING] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalSpent' }
        }
      }
    ]);

    return stats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      bannedUsers: 0,
      pendingUsers: 0,
      totalRevenue: 0,
    };
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date()
    });
  }

  async verifyUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { isVerified: true, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash -refreshTokenHash').lean();

    return updatedUser;
  }
}


