import { Injectable } from '@nestjs/common';

@Injectable()
export class SubmissionsService {
  findAll() {
    return [
      {
        id: 'submission-1',
        assignmentId: 'assignment-1',
        status: 'submitted',
        submittedAt: '2026-03-23T10:00:00Z',
      },
    ];
  }
}
