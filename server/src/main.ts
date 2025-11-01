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

  // Security middlewares
  app.use(helmet())
  app.use(compression())

  app.setGlobalPrefix('api')

  const corsOrigins = (config.get<string>('CORS_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean)
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })

  bootstrapSwagger(app)

  await app.listen(port, () => {
    Logger.log(port, 'PORT')
  })
}

bootstrap()