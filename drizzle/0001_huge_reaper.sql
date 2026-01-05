CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`ipAddress` varchar(255),
	`userAgent` text,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`image` varchar(500),
	`phone` varchar(20),
	`role` varchar(50) NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
RENAME TABLE `users` TO `account`;--> statement-breakpoint
ALTER TABLE `account` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `password` text;--> statement-breakpoint
ALTER TABLE `account` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `account` ADD `accountId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `providerId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `userId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `accessToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `refreshToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `idToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `accessTokenExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `account` ADD `refreshTokenExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `account` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `avatar`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `updated_at`;