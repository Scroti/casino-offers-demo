import { Logger, VersioningType } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import compression from 'compression'

import { bootstrapSwagger } from '@offers/commons'

import { AppModule } from './app.module'

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: process.env.NODE_ENV !== 'production',
      forbidUnknownValues: process.env.NODE_ENV !== 'production',
      enableDebugMessages: process.env.NODE_ENV !== 'production',
    })
  )

  const config: ConfigService = app.get(ConfigService)
  const port: number = Number(process.env.PORT || config.get<number>('PORT') || 3000)

  app.enableVersioning({
    defaultVersion: config.get<string>('APP_VERSIONING_DEFAULT_VERSION'),
    type: VersioningType.URI,
  })

  app.setGlobalPrefix('api')

  // Configure CORS - Must be BEFORE other middleware
  const corsOriginsString = config.get<string>('CORS_ORIGINS') || ''
  const corsOrigins = corsOriginsString.split(',').map(s => s.trim()).filter(Boolean)
  
  // IMPORTANT: When credentials: true, origin CANNOT be wildcard (*)
  // It MUST be specific origin(s) - browser will reject wildcard with credentials
  if (corsOrigins.length === 0) {
    Logger.warn('CORS_ORIGINS not set - CORS with credentials requires specific origins!', 'CORS')
  }
  
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true, // Will fail if credentials:true and wildcard
    credentials: true, // Required for cookies/auth tokens
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  })
  
  Logger.log(`CORS configured - Origins: ${corsOrigins.length ? corsOrigins.join(', ') : 'WILDCARD (will fail with credentials)'}, Credentials: true`, 'CORS')

  // Security middlewares - Configure Helmet to not interfere with CORS
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  )
  app.use(compression())

  bootstrapSwagger(app)

  await app.listen(port, () => {
    Logger.log(`Application is running on port: ${port}`, 'Bootstrap')
    Logger.log(`Health check available at: /api/v1/health`, 'Bootstrap')
  })
}

bootstrap()