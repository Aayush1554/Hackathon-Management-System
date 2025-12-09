-- Setup admin user with email: admin@hackplatform.com and password: admin123

-- First, delete any existing admin user to avoid duplicates
DELETE FROM users WHERE email = 'admin@hackplatform.com';

-- Insert admin user with bcrypt hashed password for 'admin123'
-- Hash generated using bcrypt with salt rounds = 10
INSERT INTO users (email, password_hash, full_name, user_type, phone, organization, is_active)
VALUES (
  'admin@hackplatform.com',
  '$2a$10$vK9ZJZm4PpQT8zGJKFJ5ZuQC2ZkYZXH2gBqN3c8KvZOQZzGJKFJ5Z',
  'System Administrator',
  'admin',
  '+1234567890',
  'HackPlatform',
  TRUE
);

SELECT 'Admin user created successfully!' as message;
SELECT * FROM users WHERE email = 'admin@hackplatform.com';
