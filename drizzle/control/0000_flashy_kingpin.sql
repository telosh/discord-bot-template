CREATE TABLE `guilds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`db_url` text,
	`db_token` text,
	`created_at` integer NOT NULL
);
