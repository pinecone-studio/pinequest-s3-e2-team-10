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

export const uploadedFiles = sqliteTable('uploaded_files', {
  id: text('id').primaryKey(),
  bucket: text('bucket').notNull(),
  key: text('key').notNull(),
  folder: text('folder').notNull(),
  originalName: text('original_name').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
});
