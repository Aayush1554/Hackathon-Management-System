const fs = require('fs');
const path = require('path');
const db = require('./config/database');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...\n');
    
    // Read all SQL files
    const sqlFiles = [
      '../database/hackathon_schema.sql',
      '../database/mentor_tables.sql',
      '../database/add_leaderboard_final.sql',
      '../database/add_project_zip_column.sql',
      '../database/add_message_delete.sql'
    ];
    
    for (const sqlFile of sqlFiles) {
      const filePath = path.join(__dirname, sqlFile);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠ Skipping ${path.basename(sqlFile)} - file not found`);
        continue;
      }
      
      console.log(`📄 Executing ${path.basename(sqlFile)}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by semicolon and filter out empty statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await db.query(statement);
        } catch (error) {
          // Ignore some common errors
          if (error.code === 'ER_DB_DROP_EXISTS' || 
              error.code === 'ER_TABLE_EXISTS_ERROR' ||
              error.code === 'ER_DUP_FIELDNAME') {
            // Table already exists or column already exists - that's okay
            continue;
          }
          // Only show error for actual problems
          if (!error.message.includes('Unknown database') && 
              !error.message.includes('already exists')) {
            console.error(`  ⚠ Warning: ${error.message.substring(0, 100)}`);
          }
        }
      }
      
      console.log(`  ✓ Completed ${path.basename(sqlFile)}`);
    }
    
    console.log('\n✅ Database setup completed!\n');
    
    // Verify tables were created
    const [tables] = await db.query('SHOW TABLES');
    console.log('📋 Tables created:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
