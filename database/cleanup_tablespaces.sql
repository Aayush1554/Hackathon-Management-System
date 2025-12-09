-- STEP 1: Stop XAMPP MySQL service first, then run this
-- Or run this script in phpMyAdmin SQL tab

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- Discard tablespaces if they exist
ALTER TABLE IF EXISTS hackathons DISCARD TABLESPACE;
ALTER TABLE IF EXISTS teams DISCARD TABLESPACE;
ALTER TABLE IF EXISTS users DISCARD TABLESPACE;
ALTER TABLE IF EXISTS team_members DISCARD TABLESPACE;
ALTER TABLE IF EXISTS submissions DISCARD TABLESPACE;
ALTER TABLE IF EXISTS evaluations DISCARD TABLESPACE;
ALTER TABLE IF EXISTS mentors_hackathons DISCARD TABLESPACE;
ALTER TABLE IF EXISTS team_mentor_communications DISCARD TABLESPACE;
ALTER TABLE IF EXISTS notifications DISCARD TABLESPACE;
ALTER TABLE IF EXISTS announcements DISCARD TABLESPACE;
ALTER TABLE IF EXISTS activity_logs DISCARD TABLESPACE;

-- Now drop all tables
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS team_mentor_communications;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS mentors_hackathons;
DROP TABLE IF EXISTS hackathons;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS leaderboard_view;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Cleanup complete! Now import fix_and_create_tables.sql' as message;
