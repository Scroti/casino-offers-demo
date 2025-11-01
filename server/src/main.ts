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

  // Configure CORS BEFORE Helmet to avoid conflicts
  const corsOriginsString = config.get<string>('CORS_ORIGINS') || ''
  // Normalize origins: remove trailing slashes (browsers never send trailing slashes in Origin header)
  const corsOrigins = corsOriginsString.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean)
  
  // Use function-based origin checker for better control and debugging
  const originChecker = (origin: string | undefined): boolean | string => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return true
    }

    // If no CORS origins configured, allow all
    if (corsOrigins.length === 0) {
      Logger.warn('CORS: No origins configured, allowing all origins', 'CORS')
      return true
    }

    // Normalize origin: remove trailing slashes (browsers never send trailing slashes)
    const normalizedOrigin = origin.replace(/\/+$/, '')

    // Check if origin is in allowed list
    const isAllowed = corsOrigins.some(allowedOrigin => {
      // Normalize allowed origin for comparison
      const normalizedAllowed = allowedOrigin.replace(/\/+$/, '')
      
      // Exact match
      if (normalizedOrigin === normalizedAllowed) {
        Logger.log(`CORS: Allowed origin (exact match): ${origin}`, 'CORS')
        return true
      }
      // Wildcard subdomain support (e.g., *.amplifyapp.com)
      if (normalizedAllowed.startsWith('*.')) {
        const domain = normalizedAllowed.substring(2).replace(/\/+$/, '')
        if (normalizedOrigin.endsWith(domain)) {
          Logger.log(`CORS: Allowed origin (wildcard match): ${origin}`, 'CORS')
          return true
        }
      }
      return false
    })

    if (!isAllowed) {
      Logger.warn(`CORS: Blocked origin: ${origin}. Allowed origins: ${corsOrigins.join(', ')}`, 'CORS')
    }
    
    return isAllowed ? origin : false
  }

  const corsConfig = {
    origin: corsOrigins.length > 0 ? originChecker : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
      'Accept-Encoding',
      'Origin',
      'Referer',
      'User-Agent',
      'X-Requested-With',
      'Cache-Control',
      'Pragma',
      'If-Modified-Since',
      'If-None-Match',
      'X-CSRF-Token',
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Content-Range',
      'Content-Length',
      'Content-Type',
      'Authorization',
    ],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }
  app.enableCors(corsConfig)
  
  // Always log CORS configuration for debugging (even in production)
  Logger.log(`CORS configured with ${corsOrigins.length} origin(s): ${corsOrigins.length ? corsOrigins.join(', ') : 'ALL (wildcard)'}`, 'CORS')

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

  // Listen on 0.0.0.0 to accept connections from all network interfaces (required for Render, Docker, etc.)
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Application is running on: http://0.0.0.0:${port}`, 'Bootstrap')
    Logger.log(`Health check available at: http://0.0.0.0:${port}/api/v1/health`, 'Bootstrap')
  })
}

bootstrap()