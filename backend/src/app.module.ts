import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ResultsModule } from './modules/results/results.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    AssessmentsModule,
    AssignmentsModule,
    SubmissionsModule,
    ResultsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
