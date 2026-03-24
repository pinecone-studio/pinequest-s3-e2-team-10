import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { executeOrRethrow } from '../../common/error-handling';
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
    return executeOrRethrow(
      () => this.submissionsService.findAll(),
      'Failed to handle GET /submissions',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Submission {
    return executeOrRethrow(
      () => this.submissionsService.findOne(id),
      `Failed to handle GET /submissions/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateSubmissionDto): Submission {
    return executeOrRethrow(
      () => this.submissionsService.create(payload),
      `Failed to handle POST /submissions for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateSubmissionDto,
  ): Submission {
    return executeOrRethrow(
      () => this.submissionsService.update(id, payload),
      `Failed to handle PATCH /submissions/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Submission {
    return executeOrRethrow(
      () => this.submissionsService.remove(id),
      `Failed to handle DELETE /submissions/${id}`,
    );
  }
}
