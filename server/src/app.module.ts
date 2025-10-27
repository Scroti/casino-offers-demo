import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from 'offers/health-check';
import { Cat, CatSchema } from './shared/cat.schema';
import { CatController } from './shared/cat.controller';
import { CatService } from './shared/cat.service';
import { AuthModule } from '@offers/auth';
import { NewsletterModule } from 'offers/newsletter';
import { AdminModule } from './projects/admin-dashboard/src/admin.module';
import { CommonsModule } from '@offers/commons';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    AuthModule,
    AdminModule,
    CommonsModule,
    NewsletterModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('MONGO_DB_USER')}:${configService.get<string>('MONGO_DB_PASSWORD')}@${configService.get<string>('MONGO_DB_SERVER')}/${configService.get<string>('MONGO_DB_NAME')}?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false`,
        family: 4,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [CatController],
  providers: [CatService],
})
export class AppModule {}
