import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

type AuthRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('auth')
export class AuthController {
  /**
   * Connects the auth HTTP routes to AuthService, which owns demo-account lookup and JWT creation.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Public login route that validates LoginDto and asks AuthService to return the user plus JWT token.
   */
  @Public()
  @Post('login')
  login(@Body() body: LoginDto, @Req() request: Request) {
    return this.authService.login(body.email, body.password, {
      userAgent: request.header('user-agent'),
      ipAddress: request.ip,
    });
  }

  /**
   * Revokes the current database-backed session. The empty permission list means a valid session is enough.
   */
  @RequirePermissions()
  @Post('logout')
  logout(@Req() request: AuthRequest) {
    return this.authService.logout(request.user);
  }
}
