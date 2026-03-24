import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

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
    return executeOrRethrow(
      () => this.assignments,
      'Failed to list assignments from the in-memory store',
    );
  }

  findOne(id: string): Assignment {
    try {
      const assignment = this.assignments.find((item) => item.id === id);
      if (!assignment) {
        throw new NotFoundException(`Assignment ${id} not found`);
      }
      return assignment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load assignment ${id}`);
    }
  }

  create(payload: CreateAssignmentDto): Assignment {
    try {
      this.assignments.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create assignment ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateAssignmentDto): Assignment {
    try {
      const assignment = this.findOne(id);
      Object.assign(assignment, payload);
      return assignment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update assignment ${id}`);
    }
  }

  remove(id: string): Assignment {
    try {
      const index = this.assignments.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Assignment ${id} not found`);
      }
      const [removed] = this.assignments.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete assignment ${id}`);
    }
  }
}
