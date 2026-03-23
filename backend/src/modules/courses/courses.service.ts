import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  findAll() {
    return [
      {
        id: 'course-safety',
        title: 'Workplace Safety Basics',
        type: 'training',
      },
    ];
  }
}
