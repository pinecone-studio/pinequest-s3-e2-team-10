CREATE TABLE `assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`pass_score` integer NOT NULL,
	`attempts_allowed` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`score` integer NOT NULL,
	`passed` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`status` text NOT NULL,
	`submitted_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`role` text NOT NULL
);
