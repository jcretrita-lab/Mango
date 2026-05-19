import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { configureApp, getAppPort } from './app.bootstrap';
import { AppModule } from './app.module';

const bootstrapLogger = new Logger('Bootstrap');

/**
 * Formats startup failures for the Bootstrap logger; used only by bootstrap().catch before the app can serve requests.
 */
function formatBootstrapError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

/**
 * Creates the Nest app, applies shared HTTP configuration from app.bootstrap.ts, and starts listening on the configured port.
 */
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
