import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

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
    return executeOrRethrow(
      () => this.users,
      'Failed to list users from the in-memory store',
    );
  }

  findOne(id: string): User {
    try {
      const user = this.users.find((item) => item.id === id);
      if (!user) {
        throw new NotFoundException(`User ${id} not found`);
      }
      return user;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load user ${id}`);
    }
  }

  create(payload: CreateUserDto): User {
    try {
      this.users.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create user ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateUserDto): User {
    try {
      const user = this.findOne(id);
      Object.assign(user, payload);
      return user;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update user ${id}`);
    }
  }

  remove(id: string): User {
    try {
      const index = this.users.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`User ${id} not found`);
      }
      const [removed] = this.users.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete user ${id}`);
    }
  }
}
