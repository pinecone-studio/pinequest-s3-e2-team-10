import { Injectable } from '@nestjs/common';

@Injectable()
export class AssignmentsService {
  findAll() {
    return [
      {
        id: 'assignment-1',
        assessmentId: 'assessment-1',
        candidateId: 'u-candidate-1',
        status: 'assigned',
      },
    ];
  }
}
