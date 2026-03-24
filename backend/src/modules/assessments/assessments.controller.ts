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
  type Assessment,
  AssessmentsService,
  type CreateAssessmentDto,
  type UpdateAssessmentDto,
} from './assessments.service';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  findAll(): Assessment[] {
    return executeOrRethrow(
      () => this.assessmentsService.findAll(),
      'Failed to handle GET /assessments',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Assessment {
    return executeOrRethrow(
      () => this.assessmentsService.findOne(id),
      `Failed to handle GET /assessments/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateAssessmentDto): Assessment {
    return executeOrRethrow(
      () => this.assessmentsService.create(payload),
      `Failed to handle POST /assessments for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssessmentDto,
  ): Assessment {
    return executeOrRethrow(
      () => this.assessmentsService.update(id, payload),
      `Failed to handle PATCH /assessments/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Assessment {
    return executeOrRethrow(
      () => this.assessmentsService.remove(id),
      `Failed to handle DELETE /assessments/${id}`,
    );
  }
}
