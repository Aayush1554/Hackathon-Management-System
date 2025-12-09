const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDeleteForEveryone() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    // Check if deleted_at column exists
    console.log('📋 Checking for deleted_at column...');
    const [cols] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'deleted_at'"
    );
    
    if (cols.length === 0) {
      console.log('❌ deleted_at column does not exist. Adding it...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL
      `);
      console.log('✅ Added deleted_at column');
    } else {
      console.log('✓ deleted_at column already exists');
    }
    
    console.log('\n📋 Current table structure:');
    const [finalCols] = await connection.execute('DESCRIBE team_mentor_communications');
    
    finalCols.forEach(col => {
      if (col.Field.includes('delete')) {
        console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default !== null ? `DEFAULT ${col.Default}` : ''}`);
      }
    });
    
    console.log('\n✅ Delete for everyone feature should now work!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

fixDeleteForEveryone()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
