const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixScheduledMeetingsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    // Check current table structure
    console.log('📋 Checking scheduled_meetings table structure...');
    const [cols] = await connection.execute('DESCRIBE scheduled_meetings');
    
    console.log('\nCurrent columns:');
    cols.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    const columnNames = cols.map(col => col.Field);
    
    // Add missing columns
    const columnsToAdd = [];
    
    if (!columnNames.includes('meeting_title')) {
      columnsToAdd.push({
        name: 'meeting_title',
        sql: 'ADD COLUMN meeting_title VARCHAR(255) NOT NULL'
      });
    }
    
    if (!columnNames.includes('description')) {
      columnsToAdd.push({
        name: 'description',
        sql: 'ADD COLUMN description TEXT NULL'
      });
    }
    
    if (columnsToAdd.length > 0) {
      console.log('\n🔄 Adding missing columns...\n');
      
      for (const col of columnsToAdd) {
        await connection.execute(`ALTER TABLE scheduled_meetings ${col.sql}`);
        console.log(`  ✓ Added ${col.name} column`);
      }
    } else {
      console.log('\n✓ All required columns exist');
    }
    
    // Show final structure
    console.log('\n📋 Final table structure:');
    const [finalCols] = await connection.execute('DESCRIBE scheduled_meetings');
    
    finalCols.forEach(col => {
      const nullInfo = col.Null === 'NO' ? ' NOT NULL' : ' NULL';
      const defaultInfo = col.Default !== null ? ` DEFAULT ${col.Default}` : '';
      const keyInfo = col.Key === 'PRI' ? ' [PRIMARY KEY]' : col.Key === 'MUL' ? ' [FK]' : '';
      console.log(`  - ${col.Field} (${col.Type})${nullInfo}${defaultInfo}${keyInfo}`);
    });
    
    console.log('\n✅ scheduled_meetings table is now ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

fixScheduledMeetingsTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
