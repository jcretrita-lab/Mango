import { IsEmail, IsString, MinLength } from 'class-validator';

// Request body expected by POST /auth/login.
export class LoginDto {
  // Must be a valid email because users login by email address.
  @IsEmail()
  email!: string;

  // Must be a string with a minimum length before AuthService checks the hash.
  @IsString()
  @MinLength(8)
  password!: string;
}
