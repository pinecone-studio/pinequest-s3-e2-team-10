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
  type Assignment,
  AssignmentsService,
  type CreateAssignmentDto,
  type UpdateAssignmentDto,
} from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll(): Assignment[] {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Assignment {
    return this.assignmentsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateAssignmentDto): Assignment {
    return this.assignmentsService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssignmentDto,
  ): Assignment {
    return this.assignmentsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Assignment {
    return this.assignmentsService.remove(id);
  }
}
