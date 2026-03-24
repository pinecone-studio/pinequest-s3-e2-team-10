import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrow, rethrowAsInternal } from '../../common/error-handling';

export type Course = {
  id: string;
  title: string;
  type: string;
};

export type CreateCourseDto = Course;
export type UpdateCourseDto = Partial<Omit<Course, 'id'>>;

@Injectable()
export class CoursesService {
  private readonly courses: Course[] = [
    {
      id: 'course-safety',
      title: 'Workplace Safety Basics',
      type: 'training',
    },
  ];

  findAll(): Course[] {
    return executeOrRethrow(
      () => this.courses,
      'Failed to list courses from the in-memory store',
    );
  }

  findOne(id: string): Course {
    try {
      const course = this.courses.find((item) => item.id === id);
      if (!course) {
        throw new NotFoundException(`Course ${id} not found`);
      }
      return course;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load course ${id}`);
    }
  }

  create(payload: CreateCourseDto): Course {
    try {
      this.courses.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create course ${payload.id}`);
    }
  }

  update(id: string, payload: UpdateCourseDto): Course {
    try {
      const course = this.findOne(id);
      Object.assign(course, payload);
      return course;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update course ${id}`);
    }
  }

  remove(id: string): Course {
    try {
      const index = this.courses.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Course ${id} not found`);
      }
      const [removed] = this.courses.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete course ${id}`);
    }
  }
}
