-- SQL script to create 10 test users for login
-- Run this after recreating your users table

INSERT INTO users (email, password_hash, full_name, user_type, phone, is_active)
VALUES
  ('user1@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty1', 'user1', 'team_member', '+911234567890', TRUE),
  ('user2@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty2', 'user2', 'team_member', '+911234567891', TRUE),
  ('user3@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty3', 'user3', 'team_member', '+911234567892', TRUE),
  ('user4@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty4', 'user4', 'team_member', '+911234567893', TRUE),
  ('user5@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty5', 'user5', 'team_member', '+911234567894', TRUE),
  ('user6@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty6', 'user6', 'team_member', '+911234567895', TRUE),
  ('user7@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty7', 'user7', 'team_member', '+911234567896', TRUE),
  ('user8@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty8', 'user8', 'team_member', '+911234567897', TRUE),
  ('user9@gmail.com',  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty9', 'user9', 'team_member', '+911234567898', TRUE),
  ('user10@gmail.com', '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwerty0', 'user10', 'team_member', '+911234567899', TRUE);
-- Replace the password_hash values with actual bcrypt hashes for 'useriuseri' if needed
