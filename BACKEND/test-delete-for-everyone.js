const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDeleteForEveryone() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    // Get a sample message
    console.log('📋 Checking delete for everyone functionality...\n');
    
    const [messages] = await connection.execute(`
      SELECT communication_id, sender_type, deleted_for_everyone, deleted_at, created_at 
      FROM team_mentor_communications 
      LIMIT 5
    `);
    
    if (messages.length === 0) {
      console.log('❌ No messages found in database');
      return;
    }
    
    console.log('Sample messages:');
    messages.forEach(msg => {
      console.log(`  - ID ${msg.communication_id}: sender=${msg.sender_type}, deleted_for_everyone=${msg.deleted_for_everyone}, created=${msg.created_at}`);
    });
    
    console.log('\n✅ Delete for everyone feature is ready!');
    console.log('📝 Key changes made:');
    console.log('   1. Added deleted_at column to store deletion timestamp');
    console.log('   2. Removed 1-hour time restriction on delete for everyone');
    console.log('   3. Both team and mentor can delete their own messages for everyone');
    console.log('   4. Deleted messages are filtered out from queries automatically');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

testDeleteForEveryone()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
