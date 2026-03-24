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
  type CreateResultDto,
  type Result,
  ResultsService,
  type UpdateResultDto,
} from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  findAll(): Result[] {
    return executeOrRethrow(
      () => this.resultsService.findAll(),
      'Failed to handle GET /results',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Result {
    return executeOrRethrow(
      () => this.resultsService.findOne(id),
      `Failed to handle GET /results/${id}`,
    );
  }

  @Post()
  create(@Body() payload: CreateResultDto): Result {
    return executeOrRethrow(
      () => this.resultsService.create(payload),
      `Failed to handle POST /results for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateResultDto): Result {
    return executeOrRethrow(
      () => this.resultsService.update(id, payload),
      `Failed to handle PATCH /results/${id}`,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Result {
    return executeOrRethrow(
      () => this.resultsService.remove(id),
      `Failed to handle DELETE /results/${id}`,
    );
  }
}
