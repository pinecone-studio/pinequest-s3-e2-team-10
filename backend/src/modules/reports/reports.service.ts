import { Injectable } from '@nestjs/common';

export type ReportsSummary = {
  completionRate: number;
  coverage: number;
  averageScore: number;
  passRate: number;
};

@Injectable()
export class ReportsService {
  getSummary(): ReportsSummary {
    return {
      completionRate: 100,
      coverage: 1,
      averageScore: 82,
      passRate: 100,
    };
  }
}
