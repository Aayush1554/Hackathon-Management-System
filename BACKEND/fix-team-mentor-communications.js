require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixTeamMentorCommunications() {
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
    
    // Check current table structure
    console.log('📋 Current table structure:');
    const [currentStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    currentStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    console.log('');
    
    // Check and add mentor_id column
    const [mentorIdColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'mentor_id'"
    );
    
    if (mentorIdColumns.length === 0) {
      console.log('Adding mentor_id column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN mentor_id INT NOT NULL AFTER team_id,
        ADD FOREIGN KEY (mentor_id) REFERENCES users(user_id)
      `);
      console.log('✓ Added mentor_id column');
    } else {
      console.log('✓ mentor_id column already exists');
    }
    
    // Check and add deleted_for_everyone column
    const [deletedEveryoneColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'deleted_for_everyone'"
    );
    
    if (deletedEveryoneColumns.length === 0) {
      console.log('Adding deleted_for_everyone column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN deleted_for_everyone BOOLEAN DEFAULT FALSE
      `);
      console.log('✓ Added deleted_for_everyone column');
    } else {
      console.log('✓ deleted_for_everyone column already exists');
    }
    
    // Check and add deleted_for_sender column
    const [deletedSenderColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'deleted_for_sender'"
    );
    
    if (deletedSenderColumns.length === 0) {
      console.log('Adding deleted_for_sender column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN deleted_for_sender BOOLEAN DEFAULT FALSE
      `);
      console.log('✓ Added deleted_for_sender column');
    } else {
      console.log('✓ deleted_for_sender column already exists');
    }
    
    // Check and add deleted_for_receiver column
    const [deletedReceiverColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'deleted_for_receiver'"
    );
    
    if (deletedReceiverColumns.length === 0) {
      console.log('Adding deleted_for_receiver column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN deleted_for_receiver BOOLEAN DEFAULT FALSE
      `);
      console.log('✓ Added deleted_for_receiver column');
    } else {
      console.log('✓ deleted_for_receiver column already exists');
    }
    
    // Show final table structure
    console.log('\n📋 Updated table structure:');
    const [finalStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    finalStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('\n✅ team_mentor_communications table fixed successfully!');
    
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

fixTeamMentorCommunications();
