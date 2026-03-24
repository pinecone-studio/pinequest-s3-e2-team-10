import { Injectable, NotFoundException } from '@nestjs/common';

export type Assignment = {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: string;
};

export type CreateAssignmentDto = Assignment;
export type UpdateAssignmentDto = Partial<Omit<Assignment, 'id'>>;

@Injectable()
export class AssignmentsService {
  private readonly assignments: Assignment[] = [
    {
      id: 'assignment-1',
      assessmentId: 'assessment-1',
      candidateId: 'u-candidate-1',
      status: 'assigned',
    },
  ];

  findAll(): Assignment[] {
    return this.assignments;
  }

  findOne(id: string): Assignment {
    const assignment = this.assignments.find((item) => item.id === id);
    if (!assignment) {
      throw new NotFoundException(`Assignment ${id} not found`);
    }
    return assignment;
  }

  create(payload: CreateAssignmentDto): Assignment {
    this.assignments.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateAssignmentDto): Assignment {
    const assignment = this.findOne(id);
    Object.assign(assignment, payload);
    return assignment;
  }

  remove(id: string): Assignment {
    const index = this.assignments.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Assignment ${id} not found`);
    }
    const [removed] = this.assignments.splice(index, 1);
    return removed;
  }
}
