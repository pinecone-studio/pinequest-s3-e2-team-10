import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

export type Submission = {
  id: string;
  assignmentId: string;
  status: string;
  submittedAt: string;
};

export type CreateSubmissionDto = Submission;
export type UpdateSubmissionDto = Partial<Omit<Submission, 'id'>>;

@Injectable()
export class SubmissionsService {
  private readonly submissions: Submission[] = [
    {
      id: 'submission-1',
      assignmentId: 'assignment-1',
      status: 'submitted',
      submittedAt: '2026-03-23T10:00:00Z',
    },
  ];

  findAll(): Submission[] {
    return executeOrRethrow(
      () => this.submissions,
      'Failed to list submissions from the in-memory store',
    );
  }

  findOne(id: string): Submission {
    try {
      const submission = this.submissions.find((item) => item.id === id);
      if (!submission) {
        throw new NotFoundException(`Submission ${id} not found`);
      }
      return submission;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load submission ${id}`);
    }
  }

  create(payload: CreateSubmissionDto): Submission {
    try {
      this.submissions.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create submission ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateSubmissionDto): Submission {
    try {
      const submission = this.findOne(id);
      Object.assign(submission, payload);
      return submission;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update submission ${id}`);
    }
  }

  remove(id: string): Submission {
    try {
      const index = this.submissions.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Submission ${id} not found`);
      }
      const [removed] = this.submissions.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete submission ${id}`);
    }
  }
}
