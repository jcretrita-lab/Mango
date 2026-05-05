import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { configureApp, getAppPort } from './app.bootstrap';
import { AppModule } from './app.module';

const bootstrapLogger = new Logger('Bootstrap');

function formatBootstrapError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureApp(app);
  await app.listen(getAppPort(configService));
}

void bootstrap().catch((error: unknown) => {
  bootstrapLogger.error(formatBootstrapError(error));
  process.exitCode = 1;
});
