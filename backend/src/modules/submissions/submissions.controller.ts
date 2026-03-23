import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  type CreateSubmissionDto,
  type Submission,
  SubmissionsService,
  type UpdateSubmissionDto,
} from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  findAll(): Submission[] {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Submission {
    return this.submissionsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateSubmissionDto): Submission {
    return this.submissionsService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateSubmissionDto,
  ): Submission {
    return this.submissionsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Submission {
    return this.submissionsService.remove(id);
  }
}
