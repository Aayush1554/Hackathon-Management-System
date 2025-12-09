const db = require('./config/database');

(async () => {
  try {
    const [hackathons] = await db.query('SELECT COUNT(*) as count FROM hackathons');
    console.log('✓ Hackathons table:', hackathons[0].count, 'records');
    
    const [users] = await db.query('SELECT email, user_type FROM users');
    console.log('✓ Users table:', users.length, 'users');
    users.forEach(u => console.log(`  - ${u.email} (${u.user_type})`));
    
    const [teams] = await db.query('SELECT COUNT(*) as count FROM teams');
    console.log('✓ Teams table:', teams[0].count, 'records');
    
    console.log('\n✅ Database is ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
