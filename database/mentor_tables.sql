-- Mentor Management System Tables
-- Run this SQL in phpMyAdmin to create the mentor-related tables

-- First, drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS `team_mentor_communications`;
DROP TABLE IF EXISTS `scheduled_meetings`;
DROP TABLE IF EXISTS `mentor_team_assignments`;

-- Table 1: Mentor-Team Assignments
CREATE TABLE IF NOT EXISTS `mentor_team_assignments` (
  `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mentor_id` INT NOT NULL,
  `team_id` INT NOT NULL,
  `assigned_by` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `notes` TEXT,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_mentor_team` (`mentor_id`, `team_id`),
  FOREIGN KEY (`mentor_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT,
  INDEX `idx_mentor` (`mentor_id`),
  INDEX `idx_team` (`team_id`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: Scheduled Meetings
CREATE TABLE IF NOT EXISTS `scheduled_meetings` (
  `meeting_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mentor_id` INT NOT NULL,
  `team_id` INT NOT NULL,
  `meeting_title` VARCHAR(255) NOT NULL,
  `meeting_link` VARCHAR(500) NOT NULL,
  `meeting_date` DATETIME NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`mentor_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE CASCADE,
  INDEX `idx_mentor` (`mentor_id`),
  INDEX `idx_team` (`team_id`),
  INDEX `idx_meeting_date` (`meeting_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: Team-Mentor Communications
CREATE TABLE IF NOT EXISTS `team_mentor_communications` (
  `communication_id` INT AUTO_INCREMENT PRIMARY KEY,
  `team_id` INT NOT NULL,
  `mentor_id` INT NOT NULL,
  `sender_type` ENUM('mentor', 'team') NOT NULL,
  `message_text` TEXT,
  `file_url` VARCHAR(500),
  `file_name` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE CASCADE,
  FOREIGN KEY (`mentor_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  INDEX `idx_team_mentor` (`team_id`, `mentor_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
