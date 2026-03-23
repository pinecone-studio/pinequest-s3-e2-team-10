import { Injectable, NotFoundException } from '@nestjs/common';

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
    return this.courses;
  }

  findOne(id: string): Course {
    const course = this.courses.find((item) => item.id === id);
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  create(payload: CreateCourseDto): Course {
    this.courses.push(payload);
    return payload;
  }

  update(id: string, payload: UpdateCourseDto): Course {
    const course = this.findOne(id);
    Object.assign(course, payload);
    return course;
  }

  remove(id: string): Course {
    const index = this.courses.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    const [removed] = this.courses.splice(index, 1);
    return removed;
  }
}
