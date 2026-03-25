import { Injectable } from '@nestjs/common';
import type {
  CreateExamDto,
  Exam,
  ExamQuestion,
  ExamQuestionType,
  ExamSchedule,
  ExamStatus,
  ReportReleaseMode,
} from './exams.types';

type ExamRecord = {
  id: string;
  title: string;
  durationMinutes: number;
  reportReleaseMode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ExamQuestionRecord = {
  id: string;
  examId: string;
  type: string;
  prompt: string;
  optionsJson: string | null;
  correctAnswer: string | null;
  points: number;
  displayOrder: number;
};

type ExamScheduleRecord = {
  id: string;
  examId: string;
  classId: string;
  scheduledDate: string;
  scheduledTime: string;
};

@Injectable()
export class ExamsService {
  mapExamRecord(
    exam: ExamRecord,
    questions: ExamQuestionRecord[],
    schedules: ExamScheduleRecord[],
  ): Exam {
    return {
      id: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      reportReleaseMode: this.toReportReleaseMode(exam.reportReleaseMode),
      status: this.toExamStatus(exam.status),
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      questions: questions
        .sort((left, right) => left.displayOrder - right.displayOrder)
        .map((question) => this.mapQuestionRecord(question)),
      schedules: schedules.map((schedule) => this.mapScheduleRecord(schedule)),
    };
  }

  buildExamInsert(dto: CreateExamDto, examId: string, timestamp: string) {
    return {
      id: examId,
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      reportReleaseMode: dto.reportReleaseMode,
      status: dto.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  buildQuestionInserts(dto: CreateExamDto, examId: string) {
    return dto.questions.map((question, index) => ({
      id: `${examId}-question-${index + 1}`,
      examId,
      type: question.type,
      prompt: question.question,
      optionsJson: question.options ? JSON.stringify(question.options) : null,
      correctAnswer: question.correctAnswer ?? null,
      points: question.points,
      displayOrder: question.order,
    }));
  }

  buildScheduleInserts(dto: CreateExamDto, examId: string) {
    return dto.schedules.map((schedule, index) => ({
      id: `${examId}-schedule-${index + 1}`,
      examId,
      classId: schedule.classId,
      scheduledDate: schedule.date,
      scheduledTime: schedule.time,
    }));
  }

  private mapQuestionRecord(question: ExamQuestionRecord): ExamQuestion {
    return {
      id: question.id,
      type: this.toQuestionType(question.type),
      question: question.prompt,
      options: question.optionsJson
        ? (JSON.parse(question.optionsJson) as string[])
        : undefined,
      correctAnswer: question.correctAnswer ?? undefined,
      points: question.points,
      order: question.displayOrder,
    };
  }

  private mapScheduleRecord(schedule: ExamScheduleRecord): ExamSchedule {
    return {
      id: schedule.id,
      classId: schedule.classId,
      date: schedule.scheduledDate,
      time: schedule.scheduledTime,
    };
  }

  private toQuestionType(value: string): ExamQuestionType {
    return value as ExamQuestionType;
  }

  private toExamStatus(value: string): ExamStatus {
    return value as ExamStatus;
  }

  private toReportReleaseMode(value: string): ReportReleaseMode {
    return value as ReportReleaseMode;
  }
}

