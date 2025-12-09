const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createTestUsers() {
  try {
    console.log('🔄 Creating 10 test users...\n');

    const users = [];
    
    // Generate 10 users
    for (let i = 1; i <= 10; i++) {
      const email = `user${i}@gmail.com`;
      const password = `user${i}user${i}`;
      const fullName = `user${i}`;
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      users.push({
        email,
        passwordHash,
        fullName,
        password
      });
    }

    // Insert all users
    for (const user of users) {
      try {
        // Check if user already exists
        const [existing] = await db.query(
          'SELECT email FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`  ⚠ User ${user.email} already exists - skipping`);
          continue;
        }

        // Insert new user
        await db.query(
          'INSERT INTO users (email, password_hash, full_name, user_type, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)',
          [
            user.email,
            user.passwordHash,
            user.fullName,
            'team_member',
            `+9112345678${String(users.indexOf(user)).padStart(2, '0')}`,
            true
          ]
        );
        
        console.log(`  ✓ Created: ${user.email} (password: ${user.password})`);
      } catch (err) {
        console.error(`  ✗ Error creating ${user.email}:`, err.message);
      }
    }

    console.log('\n✅ Test users creation completed!');
    console.log('\n📋 Login Credentials:');
    console.log('-----------------------------------');
    for (let i = 1; i <= 10; i++) {
      console.log(`Email: user${i}@gmail.com | Password: user${i}user${i}`);
    }
    console.log('-----------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
