import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserManagementController } from './controllers/user-management.controller';
import { AuthService } from './services/auth.service';
import { UserManagementService } from './services/user-management.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './data-access/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES') as any,
          },
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController, UserManagementController],
  providers: [AuthService, UserManagementService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, UserManagementService],
})
export class AuthModule {}
