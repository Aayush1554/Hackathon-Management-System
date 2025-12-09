require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixCommunicationsColumns() {
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
    
    // Check if message_text column exists
    const [messageTextColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'message_text'"
    );
    
    if (messageTextColumns.length === 0) {
      // Check if message column exists
      const [messageColumns] = await connection.execute(
        "SHOW COLUMNS FROM team_mentor_communications LIKE 'message'"
      );
      
      if (messageColumns.length > 0) {
        console.log('Renaming message column to message_text...');
        await connection.execute(`
          ALTER TABLE team_mentor_communications 
          CHANGE COLUMN message message_text TEXT NOT NULL
        `);
        console.log('✓ Renamed message to message_text');
      } else {
        console.log('Adding message_text column...');
        await connection.execute(`
          ALTER TABLE team_mentor_communications 
          ADD COLUMN message_text TEXT NOT NULL AFTER sender_type
        `);
        console.log('✓ Added message_text column');
      }
    } else {
      console.log('✓ message_text column already exists');
    }
    
    // Check and add file_url column
    const [fileUrlColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'file_url'"
    );
    
    if (fileUrlColumns.length === 0) {
      console.log('Adding file_url column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN file_url VARCHAR(500) NULL AFTER message_text
      `);
      console.log('✓ Added file_url column');
    } else {
      console.log('✓ file_url column already exists');
    }
    
    // Check and add file_name column
    const [fileNameColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'file_name'"
    );
    
    if (fileNameColumns.length === 0) {
      console.log('Adding file_name column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN file_name VARCHAR(255) NULL AFTER file_url
      `);
      console.log('✓ Added file_name column');
    } else {
      console.log('✓ file_name column already exists');
    }
    
    // Show final table structure
    console.log('\n📋 Final team_mentor_communications structure:');
    const [finalStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    finalStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n✅ Communications table fixed successfully!');
    console.log('\nNow supports:');
    console.log('   • Text messages');
    console.log('   • File attachments');
    console.log('   • Message deletion');
    
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

fixCommunicationsColumns();
