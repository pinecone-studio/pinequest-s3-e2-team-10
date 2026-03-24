import { Injectable, NotFoundException } from '@nestjs/common';

export type User = {
  id: string;
  username: string;
  role: string;
};

export type CreateUserDto = User;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 'u-reviewer-1', username: 'AAAA', role: 'reviewer' },
    { id: 'u-candidate-1', username: 'BBBB', role: 'candidate' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  create(payload: CreateUserDto): User {
    this.users.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, payload);
    return user;
  }

  remove(id: string): User {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`User ${id} not found`);
    }
    const [removed] = this.users.splice(index, 1);
    return removed;
  }
}
