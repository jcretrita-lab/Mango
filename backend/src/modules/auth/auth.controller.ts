import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('demo-accounts')
  getDemoAccounts() {
    return this.authService.getDemoAccounts();
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
