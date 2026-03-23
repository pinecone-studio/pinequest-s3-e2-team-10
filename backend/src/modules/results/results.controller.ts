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
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Result {
    return this.resultsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateResultDto): Result {
    return this.resultsService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateResultDto): Result {
    return this.resultsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Result {
    return this.resultsService.remove(id);
  }
}
