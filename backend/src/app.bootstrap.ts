import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  API_DESCRIPTION,
  API_DOCS_PATH,
  API_PREFIX,
  API_TITLE,
  API_VERSION,
} from './common/constants/app.constants';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import {
  CORS_ORIGINS_CONFIG_KEY,
  DEFAULT_PORT,
  PORT_CONFIG_KEY,
  type EnvironmentConfiguration,
} from './config/configuration';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService<EnvironmentConfiguration>);
  const corsOrigins =
    configService.get<readonly string[]>(CORS_ORIGINS_CONFIG_KEY) ??
    (['http://localhost:5173'] as const);

  app.enableShutdownHooks();
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  SwaggerModule.setup(
    API_DOCS_PATH,
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(API_TITLE)
        .setDescription(API_DESCRIPTION)
        .setVersion(API_VERSION)
        .addBearerAuth()
        .build(),
    ),
  );
}

export function getAppPort(
  configService: ConfigService<EnvironmentConfiguration>,
): number {
  return configService.get(PORT_CONFIG_KEY, DEFAULT_PORT);
}
