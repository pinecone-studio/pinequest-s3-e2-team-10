import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 'u-reviewer-1', username: 'AAAA', role: 'reviewer' },
      { id: 'u-candidate-1', username: 'BBBB', role: 'candidate' },
    ];
  }
}
