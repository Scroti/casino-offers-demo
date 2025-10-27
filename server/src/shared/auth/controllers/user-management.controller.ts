import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UserManagementService } from '../services/user-management.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangeUserStatusDto,
  ChangeUserRoleDto,
  SendEmailDto,
  BulkDeleteUsersDto,
  BulkChangeStatusDto,
} from '../data-access/dtos/user-management.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('debug')
  async debugUser(@Req() req: Request) {
    const user = req.user as any;
    return {
      user: user,
      role: user.role,
      id: user._id,
      email: user.email,
      hasAdminRole: user.role === 'admin',
      hasModeratorRole: user.role === 'moderator',
      isAdminOrModerator: ['admin', 'moderator'].includes(user.role),
    };
  }

  @Get()
  async getAllUsers(@Req() req: Request) {
    // Check if user has admin or moderator role
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.getAllUsers();
  }

  @Get('stats')
  async getUserStats(@Req() req: Request) {
    // Check if user has admin role
    const user = req.user as any;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.getUserStats();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    // Check if user has admin or moderator role, or is accessing their own profile
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role) && user.id !== id) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    // Check if user has admin role
    const user = req.user as any;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.createUser(createUserDto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    // Check if user has admin role, or is updating their own profile (with restrictions)
    const user = req.user as any;
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Non-admin users can only update their own name and profile image
    if (user.role !== 'admin' && user.id === id) {
      const allowedFields = ['name', 'profileImageUrl'];
      const filteredDto = Object.keys(updateUserDto)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateUserDto[key];
          return obj;
        }, {});
      
      return this.userManagementService.updateUser(id, filteredDto);
    }

    return this.userManagementService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    // Check if user has admin role
    const user = req.user as any;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Prevent admin from deleting themselves
    if (user.id === id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    return this.userManagementService.deleteUser(id);
  }

  @Patch(':id/status')
  async changeUserStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeUserStatusDto,
    @Req() req: Request,
  ) {
    // Check if user has admin or moderator role
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Prevent users from changing their own status
    if (user.id === id) {
      throw new ForbiddenException('Cannot change your own status');
    }

    return this.userManagementService.changeUserStatus(id, changeStatusDto);
  }

  @Patch(':id/role')
  async changeUserRole(
    @Param('id') id: string,
    @Body() changeRoleDto: ChangeUserRoleDto,
    @Req() req: Request,
  ) {
    // Check if user has admin role
    const user = req.user as any;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Prevent admin from changing their own role
    if (user.id === id) {
      throw new ForbiddenException('Cannot change your own role');
    }

    return this.userManagementService.changeUserRole(id, changeRoleDto);
  }

  @Post(':id/email')
  async sendEmailToUser(
    @Param('id') id: string,
    @Body() sendEmailDto: SendEmailDto,
    @Req() req: Request,
  ) {
    // Check if user has admin or moderator role
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.sendEmailToUser(id, sendEmailDto);
  }

  @Post('bulk-delete')
  async bulkDeleteUsers(
    @Body() bulkDeleteDto: BulkDeleteUsersDto,
    @Req() req: Request,
  ) {
    // Check if user has admin role
    const user = req.user as any;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Prevent admin from deleting themselves
    if (bulkDeleteDto.userIds.includes(user.id)) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    return this.userManagementService.bulkDeleteUsers(bulkDeleteDto);
  }

  @Post('bulk-status')
  async bulkChangeStatus(
    @Body() bulkChangeStatusDto: BulkChangeStatusDto,
    @Req() req: Request,
  ) {
    // Check if user has admin or moderator role
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Prevent users from changing their own status
    if (bulkChangeStatusDto.userIds.includes(user.id)) {
      throw new ForbiddenException('Cannot change your own status');
    }

    return this.userManagementService.bulkChangeStatus(bulkChangeStatusDto);
  }

  @Patch(':id/verify')
  async verifyUser(@Param('id') id: string, @Req() req: Request) {
    // Check if user has admin or moderator role
    const user = req.user as any;
    if (!['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.userManagementService.verifyUser(id);
  }
}
