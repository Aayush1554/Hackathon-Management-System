require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixMentorTeamAssignments() {
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
    
    // Check if is_active column exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM mentor_team_assignments LIKE 'is_active'"
    );
    
    if (columns.length === 0) {
      console.log('Adding is_active column to mentor_team_assignments table...');
      await connection.execute(`
        ALTER TABLE mentor_team_assignments 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE
      `);
      console.log('✓ Added is_active column');
    } else {
      console.log('✓ is_active column already exists');
    }
    
    // Check if assigned_at column exists
    const [assignedAtColumns] = await connection.execute(
      "SHOW COLUMNS FROM mentor_team_assignments LIKE 'assigned_at'"
    );
    
    if (assignedAtColumns.length === 0) {
      console.log('Adding assigned_at column to mentor_team_assignments table...');
      await connection.execute(`
        ALTER TABLE mentor_team_assignments 
        ADD COLUMN assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✓ Added assigned_at column');
    } else {
      console.log('✓ assigned_at column already exists');
    }
    
    console.log('\n✅ mentor_team_assignments table fixed successfully!');
    
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

fixMentorTeamAssignments();
