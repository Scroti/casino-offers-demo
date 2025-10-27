import { Logger, VersioningType } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { bootstrapSwagger } from '@offers/commons'

import { AppModule } from './app.module'

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      enableDebugMessages: true,
    })
  )

  const config: ConfigService = app.get(ConfigService)
  const port: number = Number(config.get<number>('APP_PORT'))

  app.enableVersioning({
    defaultVersion: config.get<string>('APP_VERSIONING_DEFAULT_VERSION'),
    type: VersioningType.URI,
  })

  app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log(`Headers:`, req.headers);
  next();
});

  app.setGlobalPrefix('api')

  app.enableCors()

  bootstrapSwagger(app)

  await app.listen(port, () => {
    Logger.log(port, 'PORT')
  })
}

bootstrap()