const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function updateAdminPassword() {
  try {
    // Generate new password hash for 'admin123'
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    console.log('Generated password hash:', passwordHash);
    
    // Update admin user password
    const [result] = await db.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, 'admin@hackplatform.com']
    );
    
    if (result.affectedRows > 0) {
      console.log('✓ Admin password updated successfully!');
      console.log('Email: admin@hackplatform.com');
      console.log('Password: admin123');
    } else {
      console.log('✗ No user found with email admin@hackplatform.com');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
