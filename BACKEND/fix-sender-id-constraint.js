require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixSenderIdConstraint() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hackathon_db'
    });
    
    console.log('✓ Database connected successfully\n');
    
    // Check current sender_id column
    console.log('📋 Checking sender_id column constraints...');
    const [senderIdInfo] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'sender_id'"
    );
    
    if (senderIdInfo.length > 0) {
      console.log(`Current sender_id: ${senderIdInfo[0].Type}, Null: ${senderIdInfo[0].Null}`);
      
      if (senderIdInfo[0].Null === 'NO') {
        console.log('\nMaking sender_id nullable...');
        await connection.execute(`
          ALTER TABLE team_mentor_communications 
          MODIFY COLUMN sender_id INT NULL
        `);
        console.log('✓ sender_id is now nullable');
      } else {
        console.log('✓ sender_id is already nullable');
      }
    }
    
    // Show final structure
    console.log('\n📋 Final team_mentor_communications structure:');
    const [finalStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    finalStructure.forEach(col => {
      const nullStatus = col.Null === 'NO' ? 'NOT NULL' : 'NULL';
      const keyInfo = col.Key ? `[${col.Key}]` : '';
      console.log(`   - ${col.Field} (${col.Type}) ${nullStatus} ${keyInfo}`);
    });
    
    console.log('\n✅ sender_id constraint fixed!');
    console.log('\nNote: sender_id is now optional. The sender can be identified by:');
    console.log('   • sender_id (if provided)');
    console.log('   • sender_type (team or mentor)');
    console.log('   • mentor_id (for mentor messages)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

fixSenderIdConstraint();
