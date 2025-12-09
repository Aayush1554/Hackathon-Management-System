require('dotenv').config();
const mysql = require('mysql2/promise');

async function addMissingColumnsToMentorAssignments() {
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
    
    // Check and add assigned_by column
    const [assignedByColumns] = await connection.execute(
      "SHOW COLUMNS FROM mentor_team_assignments LIKE 'assigned_by'"
    );
    
    if (assignedByColumns.length === 0) {
      console.log('Adding assigned_by column...');
      await connection.execute(`
        ALTER TABLE mentor_team_assignments 
        ADD COLUMN assigned_by INT NULL,
        ADD FOREIGN KEY (assigned_by) REFERENCES users(user_id)
      `);
      console.log('✓ Added assigned_by column');
    } else {
      console.log('✓ assigned_by column already exists');
    }
    
    // Check and add notes column
    const [notesColumns] = await connection.execute(
      "SHOW COLUMNS FROM mentor_team_assignments LIKE 'notes'"
    );
    
    if (notesColumns.length === 0) {
      console.log('Adding notes column...');
      await connection.execute(`
        ALTER TABLE mentor_team_assignments 
        ADD COLUMN notes TEXT NULL
      `);
      console.log('✓ Added notes column');
    } else {
      console.log('✓ notes column already exists');
    }
    
    // Show final table structure
    console.log('\n📋 Current mentor_team_assignments table structure:');
    const [tableStructure] = await connection.execute(
      'DESCRIBE mentor_team_assignments'
    );
    tableStructure.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('\n✅ mentor_team_assignments table updated successfully!');
    
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

addMissingColumnsToMentorAssignments();
