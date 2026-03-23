import { Injectable, NotFoundException } from '@nestjs/common';

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
    return this.assessments;
  }

  findOne(id: string): Assessment {
    const assessment = this.assessments.find((item) => item.id === id);
    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }
    return assessment;
  }

  create(payload: CreateAssessmentDto): Assessment {
    this.assessments.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateAssessmentDto): Assessment {
    const assessment = this.findOne(id);
    Object.assign(assessment, payload);
    return assessment;
  }

  remove(id: string): Assessment {
    const index = this.assessments.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }
    const [removed] = this.assessments.splice(index, 1);
    return removed;
  }
}
