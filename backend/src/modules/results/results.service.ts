import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

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
    return executeOrRethrow(
      () => this.results,
      'Failed to list results from the in-memory store',
    );
  }

  findOne(id: string): Result {
    try {
      const result = this.results.find((item) => item.id === id);
      if (!result) {
        throw new NotFoundException(`Result ${id} not found`);
      }
      return result;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load result ${id}`);
    }
  }

  create(payload: CreateResultDto): Result {
    try {
      this.results.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create result ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateResultDto): Result {
    try {
      const result = this.findOne(id);
      Object.assign(result, payload);
      return result;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update result ${id}`);
    }
  }

  remove(id: string): Result {
    try {
      const index = this.results.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Result ${id} not found`);
      }
      const [removed] = this.results.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete result ${id}`);
    }
  }
}
