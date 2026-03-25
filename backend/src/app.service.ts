import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

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
        'exams',
        'assessments',
        'assignments',
        'submissions',
        'results',
        'reports',
      ],
    };
  }

  getHealth() {
    const databaseConfigured = this.databaseService.isConfigured();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'pinequest-backend',
      databaseConfigured,
      uploadMetadataPersistence: databaseConfigured ? 'd1' : 'local-file',
      storageConfigured: Boolean(
        process.env.CLOUDFLARE_R2_BUCKET_NAME &&
          process.env.CLOUDFLARE_R2_ENDPOINT &&
          process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
          process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      ),
    };
  }
}
