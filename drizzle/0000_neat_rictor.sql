CREATE TABLE `site_connections` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`project_url` text NOT NULL,
	`publishable_key` text NOT NULL,
	`updated_at` text NOT NULL
);
