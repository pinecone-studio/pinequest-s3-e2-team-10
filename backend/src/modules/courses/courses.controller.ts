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
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Course {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateCourseDto): Course {
    return this.coursesService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateCourseDto): Course {
    return this.coursesService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Course {
    return this.coursesService.remove(id);
  }
}
