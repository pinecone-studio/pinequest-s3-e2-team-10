import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getRoles() {
    return {
      roles: ['reviewer', 'candidate'],
      demoAccounts: [
        { username: 'AAAA', role: 'reviewer' },
        { username: 'BBBB', role: 'candidate' },
      ],
    };
  }
}
