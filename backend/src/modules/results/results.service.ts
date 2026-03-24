import { Injectable, NotFoundException } from '@nestjs/common';

export type Result = {
  id: string;
  submissionId: string;
  score: number;
  passed: boolean;
};

export type CreateResultDto = Result;
export type UpdateResultDto = Partial<Omit<Result, 'id'>>;

@Injectable()
export class ResultsService {
  private readonly results: Result[] = [
    {
      id: 'result-1',
      submissionId: 'submission-1',
      score: 82,
      passed: true,
    },
  ];

  findAll(): Result[] {
    return this.results;
  }

  findOne(id: string): Result {
    const result = this.results.find((item) => item.id === id);
    if (!result) {
      throw new NotFoundException(`Result ${id} not found`);
    }
    return result;
  }

  create(payload: CreateResultDto): Result {
    this.results.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateResultDto): Result {
    const result = this.findOne(id);
    Object.assign(result, payload);
    return result;
  }

  remove(id: string): Result {
    const index = this.results.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Result ${id} not found`);
    }
    const [removed] = this.results.splice(index, 1);
    return removed;
  }
}
