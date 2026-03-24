import { Injectable } from '@nestjs/common';

export type AuthRole = 'reviewer' | 'candidate';

export type DemoAccount = {
  username: string;
  role: AuthRole;
};

export type AuthRolesResponse = {
  roles: AuthRole[];
  demoAccounts: DemoAccount[];
};

@Injectable()
export class AuthService {
  getRoles(): AuthRolesResponse {
    return {
      roles: ['reviewer', 'candidate'],
      demoAccounts: [
        { username: 'AAAA', role: 'reviewer' },
        { username: 'BBBB', role: 'candidate' },
      ],
    };
  }
}
