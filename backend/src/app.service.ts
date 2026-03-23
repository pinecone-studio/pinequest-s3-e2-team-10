import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOverview() {
    return {
      name: 'PineQuest LMS API',
      version: 'hackathon-scaffold',
      frontend: 'Next.js',
      backend: 'NestJS',
      modules: [
        'auth',
        'users',
        'courses',
        'assessments',
        'assignments',
        'submissions',
        'results',
        'reports',
      ],
    };
  }
}
