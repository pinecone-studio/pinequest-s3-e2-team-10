import { Controller, Get } from '@nestjs/common';
import { type ReportsSummary, ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  getSummary(): ReportsSummary {
    return this.reportsService.getSummary();
  }
}
