CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`password_hash` text NOT NULL,
	`name` varchar(120) NOT NULL DEFAULT 'Admin',
	`role` varchar(40) NOT NULL DEFAULT 'admin',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `agency_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agency_name` varchar(160) NOT NULL DEFAULT 'Louka & Vendy Real Estate',
	`logo` text,
	`logo_dark` text,
	`phone` varchar(60),
	`whatsapp` varchar(60),
	`email` varchar(190),
	`address` varchar(240),
	`instagram` text,
	`facebook` text,
	`linkedin` text,
	`default_currency` varchar(8) NOT NULL DEFAULT 'MAD',
	`seo_title` varchar(240),
	`seo_description` text,
	`years_experience` int NOT NULL DEFAULT 12,
	`properties_sold` int NOT NULL DEFAULT 450,
	`active_properties` int NOT NULL DEFAULT 250,
	`client_count` int NOT NULL DEFAULT 20,
	CONSTRAINT `agency_settings_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`photo_url` text,
	`job_title` varchar(160),
	`phone` varchar(60),
	`whatsapp` varchar(60),
	`email` varchar(190),
	`bio_fr` text,
	`bio_en` text,
	`languages` text,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title_fr` varchar(240) NOT NULL,
	`title_en` varchar(240),
	`excerpt_fr` text,
	`excerpt_en` text,
	`content_fr` text,
	`content_en` text,
	`cover_image` text,
	`category` varchar(80),
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`published_at` timestamp NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int,
	`agent_id` int,
	`name` varchar(160) NOT NULL,
	`phone` varchar(60),
	`email` varchar(190),
	`intent` varchar(40),
	`message` text,
	`source` varchar(40) NOT NULL DEFAULT 'contact',
	`status` varchar(40) NOT NULL DEFAULT 'new',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `neighborhoods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profile` json,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`description_fr` text,
	`description_en` text,
	`descriptor_fr` varchar(240),
	`descriptor_en` varchar(240),
	`cover_image` text,
	`latitude` double,
	`longitude` double,
	`published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `neighborhoods_id` PRIMARY KEY(`id`),
	CONSTRAINT `neighborhoods_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`language` varchar(8) NOT NULL DEFAULT 'fr',
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(40) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`transaction_type` varchar(20) NOT NULL DEFAULT 'sale',
	`property_type` varchar(40) NOT NULL DEFAULT 'villa',
	`title_fr` varchar(240) NOT NULL,
	`title_en` varchar(240),
	`description_fr` text,
	`description_en` text,
	`price` decimal(14,2) NOT NULL DEFAULT '0',
	`currency` varchar(8) NOT NULL DEFAULT 'MAD',
	`price_type` varchar(20) NOT NULL DEFAULT 'fixed',
	`rental_frequency` varchar(20),
	`city` varchar(120) NOT NULL DEFAULT 'Marrakech',
	`neighborhood_id` int,
	`address` varchar(240),
	`latitude` double,
	`longitude` double,
	`location_visibility` varchar(20) NOT NULL DEFAULT 'exact',
	`living_area` int,
	`land_area` int,
	`bedrooms` int,
	`bathrooms` int,
	`living_rooms` int,
	`garages` int,
	`floor` int,
	`total_floors` int,
	`year_built` int,
	`video_url` text,
	`agent_id` int,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_exclusive` boolean NOT NULL DEFAULT false,
	`is_new` boolean NOT NULL DEFAULT false,
	`is_hot_offer` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`published_at` timestamp NULL,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `properties_reference_unique` UNIQUE(`reference`),
	CONSTRAINT `properties_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `property_features` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int NOT NULL,
	`feature` varchar(80) NOT NULL,
	CONSTRAINT `property_features_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `property_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int NOT NULL,
	`image_url` text NOT NULL,
	`storage_path` text,
	`alt_text` varchar(240),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_cover` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `property_images_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `site_maintenance` (
	`id` int NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`description` text NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `site_maintenance_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote_fr` text NOT NULL,
	`quote_en` text,
	`author_name` varchar(160) NOT NULL,
	`detail` varchar(160),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `valuation_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`phone` varchar(60),
	`email` varchar(190),
	`property_type` varchar(40),
	`neighborhood` varchar(160),
	`address` varchar(240),
	`living_area` int,
	`land_area` int,
	`bedrooms` int,
	`bathrooms` int,
	`condition` varchar(60),
	`message` text,
	`status` varchar(40) NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `valuation_requests_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
