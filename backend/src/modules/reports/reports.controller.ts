import { Controller, Get } from '@nestjs/common';
import { executeOrRethrow } from '../../common/error-handling';
import { type ReportsSummary, ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  getSummary(): ReportsSummary {
    return executeOrRethrow(
      () => this.reportsService.getSummary(),
      'Failed to handle GET /reports/summary',
    );
  }
}
