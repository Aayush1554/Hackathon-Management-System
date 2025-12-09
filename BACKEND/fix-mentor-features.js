require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixMentorFeatures() {
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
    
    // 1. Create scheduled_meetings table if it doesn't exist
    console.log('📋 Checking scheduled_meetings table...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'scheduled_meetings'"
    );
    
    if (tables.length === 0) {
      console.log('Creating scheduled_meetings table...');
      await connection.execute(`
        CREATE TABLE scheduled_meetings (
          meeting_id INT PRIMARY KEY AUTO_INCREMENT,
          team_id INT NOT NULL,
          mentor_id INT NOT NULL,
          meeting_date DATETIME NOT NULL,
          meeting_link VARCHAR(500),
          meeting_notes TEXT,
          status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
          FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
          INDEX idx_team_id (team_id),
          INDEX idx_mentor_id (mentor_id),
          INDEX idx_meeting_date (meeting_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✓ Created scheduled_meetings table');
    } else {
      console.log('✓ scheduled_meetings table already exists');
    }
    
    // 2. Add sender_type column to team_mentor_communications
    console.log('\n📋 Checking team_mentor_communications columns...');
    const [senderTypeColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'sender_type'"
    );
    
    if (senderTypeColumns.length === 0) {
      console.log('Adding sender_type column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN sender_type ENUM('team', 'mentor') NOT NULL AFTER sender_id
      `);
      console.log('✓ Added sender_type column');
    } else {
      console.log('✓ sender_type column already exists');
    }
    
    // 3. Add created_at column to team_mentor_communications
    const [createdAtColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'created_at'"
    );
    
    if (createdAtColumns.length === 0) {
      console.log('Adding created_at column...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER sent_at
      `);
      console.log('✓ Added created_at column');
    } else {
      console.log('✓ created_at column already exists');
    }
    
    // 4. Show final table structures
    console.log('\n📋 Final team_mentor_communications structure:');
    const [commStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    commStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n📋 Final scheduled_meetings structure:');
    const [meetingStructure] = await connection.execute(
      'DESCRIBE scheduled_meetings'
    );
    meetingStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n✅ All mentor features fixed successfully!');
    console.log('\nNow teams can:');
    console.log('   • View and chat with assigned mentors');
    console.log('   • Schedule meetings with mentors');
    console.log('   • View meeting history');
    
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

fixMentorFeatures();
