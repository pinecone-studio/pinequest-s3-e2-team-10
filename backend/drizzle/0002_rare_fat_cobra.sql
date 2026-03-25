CREATE TABLE `exam_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`type` text NOT NULL,
	`prompt` text NOT NULL,
	`options_json` text,
	`correct_answer` text,
	`points` integer NOT NULL,
	`display_order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exam_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`class_id` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`scheduled_time` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`report_release_mode` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
