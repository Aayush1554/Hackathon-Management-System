-- Add delete functionality to team_mentor_communications table
-- This allows users to delete messages for themselves or for everyone

USE hackathon;

-- Add columns for delete functionality
ALTER TABLE `team_mentor_communications` 
ADD COLUMN `deleted_for_sender` BOOLEAN DEFAULT FALSE AFTER `reactions`,
ADD COLUMN `deleted_for_receiver` BOOLEAN DEFAULT FALSE AFTER `deleted_for_sender`,
ADD COLUMN `deleted_for_everyone` BOOLEAN DEFAULT FALSE AFTER `deleted_for_receiver`,
ADD COLUMN `deleted_at` TIMESTAMP NULL AFTER `deleted_for_everyone`;

-- Index for better query performance
CREATE INDEX idx_deleted ON `team_mentor_communications` (`deleted_for_everyone`, `deleted_for_sender`, `deleted_for_receiver`);

SELECT 'Delete columns added successfully!' as message;
