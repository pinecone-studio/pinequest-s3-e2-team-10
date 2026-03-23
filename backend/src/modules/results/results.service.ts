import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  findAll() {
    return [
      {
        id: 'result-1',
        submissionId: 'submission-1',
        score: 82,
        passed: true,
      },
    ];
  }
}
