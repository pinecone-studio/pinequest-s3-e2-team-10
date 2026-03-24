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
    return this.assessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Assessment {
    return this.assessmentsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateAssessmentDto): Assessment {
    return this.assessmentsService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssessmentDto,
  ): Assessment {
    return this.assessmentsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Assessment {
    return this.assessmentsService.remove(id);
  }
}
