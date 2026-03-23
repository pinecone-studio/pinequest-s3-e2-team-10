import { Controller, Get } from '@nestjs/common';
import { type AuthRolesResponse, AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('roles')
  getRoles(): AuthRolesResponse {
    return this.authService.getRoles();
  }
}
