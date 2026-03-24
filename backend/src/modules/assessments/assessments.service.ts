import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

export type Assessment = {
  id: string;
  title: string;
  durationMinutes: number;
  passScore: number;
  attemptsAllowed: number;
};

export type CreateAssessmentDto = Assessment;
export type UpdateAssessmentDto = Partial<Omit<Assessment, 'id'>>;

@Injectable()
export class AssessmentsService {
  private readonly assessments: Assessment[] = [
    {
      id: 'assessment-1',
      title: 'Safety Fundamentals Exam',
      durationMinutes: 20,
      passScore: 70,
      attemptsAllowed: 1,
    },
  ];

  findAll(): Assessment[] {
    return executeOrRethrow(
      () => this.assessments,
      'Failed to list assessments from the in-memory store',
    );
  }

  findOne(id: string): Assessment {
    try {
      const assessment = this.assessments.find((item) => item.id === id);
      if (!assessment) {
        throw new NotFoundException(`Assessment ${id} not found`);
      }
      return assessment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load assessment ${id}`);
    }
  }

  create(payload: CreateAssessmentDto): Assessment {
    try {
      this.assessments.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create assessment ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateAssessmentDto): Assessment {
    try {
      const assessment = this.findOne(id);
      Object.assign(assessment, payload);
      return assessment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update assessment ${id}`);
    }
  }

  remove(id: string): Assessment {
    try {
      const index = this.assessments.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Assessment ${id} not found`);
      }
      const [removed] = this.assessments.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete assessment ${id}`);
    }
  }
}
