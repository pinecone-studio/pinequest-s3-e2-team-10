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
  type Course,
  CoursesService,
  type CreateCourseDto,
  type UpdateCourseDto,
} from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Course[] {
    return executeOrRethrow(
      () => this.coursesService.findAll(),
      'Failed to handle GET /courses',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Course {
    return executeOrRethrow(
      () => this.coursesService.findOne(id),
      `Failed to handle GET /courses/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateCourseDto): Course {
    return executeOrRethrow(
      () => this.coursesService.create(payload),
      `Failed to handle POST /courses for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateCourseDto): Course {
    return executeOrRethrow(
      () => this.coursesService.update(id, payload),
      `Failed to handle PATCH /courses/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Course {
    return executeOrRethrow(
      () => this.coursesService.remove(id),
      `Failed to handle DELETE /courses/${id}`,
    );
  }
}
