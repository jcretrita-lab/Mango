import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import {
  JWT_EXPIRES_IN_CONFIG_KEY,
  JWT_SECRET_CONFIG_KEY,
  type EnvironmentConfiguration,
} from '../../config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      /**
       * Connects ConfigModule values to JwtModule so AuthService and JwtAuthGuard share the same signing settings.
       */
      useFactory: (configService: ConfigService<EnvironmentConfiguration>) => ({
        secret: configService.getOrThrow(JWT_SECRET_CONFIG_KEY),
        signOptions: {
          expiresIn: configService.getOrThrow(
            JWT_EXPIRES_IN_CONFIG_KEY,
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
