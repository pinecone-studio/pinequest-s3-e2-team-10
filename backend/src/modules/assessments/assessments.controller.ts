import { Controller, Get } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  findAll() {
    return this.assessmentsService.findAll();
  }
}
