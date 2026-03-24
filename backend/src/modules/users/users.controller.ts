import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { executeOrRethrow } from '../../common/error-handling';
import {
  type CreateUserDto,
  type UpdateUserDto,
  type User,
  UsersService,
} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return executeOrRethrow(
      () => this.usersService.findAll(),
      'Failed to handle GET /users',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return executeOrRethrow(
      () => this.usersService.findOne(id),
      `Failed to handle GET /users/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateUserDto): User {
    return executeOrRethrow(
      () => this.usersService.create(payload),
      `Failed to handle POST /users for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto): User {
    return executeOrRethrow(
      () => this.usersService.update(id, payload),
      `Failed to handle PATCH /users/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    return executeOrRethrow(
      () => this.usersService.remove(id),
      `Failed to handle DELETE /users/${id}`,
    );
  }
}
