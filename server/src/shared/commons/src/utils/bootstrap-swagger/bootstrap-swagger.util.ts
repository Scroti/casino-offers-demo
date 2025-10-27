import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

const SWAGGER_ENVIRONMENTS = ['development', 'beta', 'prod', 'local-dev']

export function bootstrapSwagger(app: INestApplication): void {
  const appConfig: ConfigService = app.get(ConfigService)

  if (!SWAGGER_ENVIRONMENTS.includes(appConfig.get<string>('APP_ENVIRONMENT'))) {
    return
  }

  const authenticationDescription = `
  To use the API(s) an access token has to be created by a techincal user:
  
  curl -s -X POST \\ \\
    --data "scope=profile" \\ \\
    --data-urlencode "client_id=idp-d6c4382b-69f0-4136-ab51-c75328188b52-ivi-cicd-dev" \\ \\
    --data-urlencode "grant_type=password" \\ \\
    --cert-type P12 --cert pk12cert:pk12password \\ \\
    https://idp.cloud.vwgroup.com/auth/realms/kums-mfa/protocol/openid-connect/token
  
  \\
  For additional information https://devstack.vwgroup.com/confluence/display/ART30/API+Authentication.
  `
  const config = new DocumentBuilder()
    .setTitle(appConfig.get<string>('APP_NAME'))
    .setDescription(authenticationDescription)
    .addTag(appConfig.get<string>('APP_SWAGGER_TAG'))
    .setVersion(appConfig.get<string>('APP_SWAGGER_VERSION'))
    .addBearerAuth(
      {
        type: 'http',
        name: 'Authorization',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'JWT'
    )
    .addServer(appConfig.get<string>('APP_SWAGGER_SERVER'), 'Server')
    .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1/swagger', app, document)
}