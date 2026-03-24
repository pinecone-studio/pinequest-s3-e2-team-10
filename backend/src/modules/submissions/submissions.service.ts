import { Injectable, NotFoundException } from '@nestjs/common';

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
    return this.submissions;
  }

  findOne(id: string): Submission {
    const submission = this.submissions.find((item) => item.id === id);
    if (!submission) {
      throw new NotFoundException(`Submission ${id} not found`);
    }
    return submission;
  }

  create(payload: CreateSubmissionDto): Submission {
    this.submissions.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateSubmissionDto): Submission {
    const submission = this.findOne(id);
    Object.assign(submission, payload);
    return submission;
  }

  remove(id: string): Submission {
    const index = this.submissions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Submission ${id} not found`);
    }
    const [removed] = this.submissions.splice(index, 1);
    return removed;
  }
}
