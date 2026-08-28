CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`author_first_name` text DEFAULT '' NOT NULL,
	`author_last_name` text DEFAULT '' NOT NULL,
	`code` text DEFAULT '' NOT NULL,
	`code_type` text DEFAULT '' NOT NULL,
	`genres` text DEFAULT '[]' NOT NULL,
	`publisher` text DEFAULT '' NOT NULL,
	`publication_year` integer,
	`saga` text DEFAULT '' NOT NULL,
	`saga_order` integer,
	`prequel` text DEFAULT '' NOT NULL,
	`sequel` text DEFAULT '' NOT NULL,
	`cover_url` text,
	`plot` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`in_library` integer DEFAULT false NOT NULL,
	`lent_to` text DEFAULT '' NOT NULL,
	`lent_date` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_books_author` ON `books` (`author_last_name`,`author_first_name`);
--> statement-breakpoint
CREATE INDEX `idx_books_saga` ON `books` (`saga`,`saga_order`);
--> statement-breakpoint
CREATE INDEX `idx_books_code` ON `books` (`code`);
