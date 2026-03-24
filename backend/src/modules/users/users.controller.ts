import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateUserDto): User {
    return this.usersService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto): User {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    return this.usersService.remove(id);
  }
}
