import { Injectable } from '@nestjs/common';

@Injectable()
export class AssessmentsService {
  findAll() {
    return [
      {
        id: 'assessment-1',
        title: 'Safety Fundamentals Exam',
        durationMinutes: 20,
        passScore: 70,
        attemptsAllowed: 1,
      },
    ];
  }
}
