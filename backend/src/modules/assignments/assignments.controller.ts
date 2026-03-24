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
    return executeOrRethrow(
      () => this.assignmentsService.findAll(),
      'Failed to handle GET /assignments',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Assignment {
    return executeOrRethrow(
      () => this.assignmentsService.findOne(id),
      `Failed to handle GET /assignments/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateAssignmentDto): Assignment {
    return executeOrRethrow(
      () => this.assignmentsService.create(payload),
      `Failed to handle POST /assignments for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssignmentDto,
  ): Assignment {
    return executeOrRethrow(
      () => this.assignmentsService.update(id, payload),
      `Failed to handle PATCH /assignments/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Assignment {
    return executeOrRethrow(
      () => this.assignmentsService.remove(id),
      `Failed to handle DELETE /assignments/${id}`,
    );
  }
}
