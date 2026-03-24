import { Controller, Get } from '@nestjs/common';
import { executeOrRethrow } from '../../common/error-handling';
import { type AuthRolesResponse, AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('roles')
  getRoles(): AuthRolesResponse {
    return executeOrRethrow(
      () => this.authService.getRoles(),
      'Failed to handle GET /auth/roles',
    );
  }
}
