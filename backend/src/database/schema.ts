import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  role: text('role').notNull(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
});

export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  passScore: integer('pass_score').notNull(),
  attemptsAllowed: integer('attempts_allowed').notNull(),
});

export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').notNull(),
  candidateId: text('candidate_id').notNull(),
  status: text('status').notNull(),
});

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  assignmentId: text('assignment_id').notNull(),
  status: text('status').notNull(),
  submittedAt: text('submitted_at').notNull(),
});

export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull(),
  score: integer('score').notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
});
