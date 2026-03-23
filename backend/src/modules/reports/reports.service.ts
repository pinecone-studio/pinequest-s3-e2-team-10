import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  getSummary() {
    return {
      completionRate: 100,
      coverage: 1,
      averageScore: 82,
      passRate: 100,
    };
  }
}
