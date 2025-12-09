const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdminUser() {
  try {
    // Generate password hash for 'admin123'
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    console.log('Generated password hash:', passwordHash);
    
    // Check if admin user already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      ['admin@hackplatform.com']
    );
    
    if (existing.length > 0) {
      console.log('⚠ Admin user already exists. Updating password...');
      const [result] = await db.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, 'admin@hackplatform.com']
      );
      console.log('✓ Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const [result] = await db.query(
        `INSERT INTO users (email, password_hash, full_name, user_type, phone, organization, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          'admin@hackplatform.com',
          passwordHash,
          'System Administrator',
          'admin',
          '+1234567890',
          'HackPlatform',
          true
        ]
      );
      console.log('✓ Admin user created successfully!');
    }
    
    console.log('\n📧 Admin Login Credentials:');
    console.log('Email: admin@hackplatform.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
