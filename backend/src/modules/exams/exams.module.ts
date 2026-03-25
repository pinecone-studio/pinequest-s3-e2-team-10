import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Module({
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}

