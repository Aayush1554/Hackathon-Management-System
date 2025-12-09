const mysql = require('mysql2/promise');
require('dotenv').config();

async function renamePrimaryKey() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    // Get database name
    const [dbResult] = await connection.execute('SELECT DATABASE() as db');
    const dbName = dbResult[0].db;
    console.log(`📋 Using database: ${dbName}\n`);
    
    // Check current column name
    const [cols] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications WHERE `Key` = 'PRI'"
    );
    
    if (cols[0].Field === 'communication_id') {
      console.log('✓ Column is already named communication_id!');
      process.exit(0);
    }
    
    console.log(`Current primary key column: ${cols[0].Field}\n`);
    
    // Get all FKs
    console.log('📋 Finding all foreign keys...');
    const [allFks] = await connection.execute(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE CONSTRAINT_SCHEMA = ?
      AND (
        (TABLE_NAME = 'team_mentor_communications' AND REFERENCED_TABLE_NAME IS NOT NULL)
        OR 
        (REFERENCED_TABLE_NAME = 'team_mentor_communications' AND REFERENCED_COLUMN_NAME = 'message_id')
      )
    `, [dbName]);
    
    console.log(`Found ${allFks.length} foreign keys to handle\n`);
    
    // Drop all FKs
    console.log('🔄 Dropping foreign keys...');
    for (const fk of allFks) {
      try {
        await connection.execute(
          `ALTER TABLE ${fk.TABLE_NAME} DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
        console.log(`  ✓ Dropped ${fk.CONSTRAINT_NAME} from ${fk.TABLE_NAME}`);
      } catch (err) {
        console.log(`  ⚠ ${fk.CONSTRAINT_NAME}: ${err.message}`);
      }
    }
    
    // Rename the column (this will preserve AUTO_INCREMENT and PRIMARY KEY)
    console.log('\n🔄 Renaming message_id to communication_id...');
    await connection.execute(`
      ALTER TABLE team_mentor_communications 
      CHANGE COLUMN message_id communication_id INT(11) NOT NULL AUTO_INCREMENT
    `);
    console.log('  ✓ Column renamed successfully!');
    
    // Also rename reply_to_message_id if it exists
    const [replyCol] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'reply_to_message_id'"
    );
    
    if (replyCol.length > 0) {
      console.log('\n🔄 Renaming reply_to_message_id to reply_to_communication_id...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        CHANGE COLUMN reply_to_message_id reply_to_communication_id INT(11) NULL
      `);
      console.log('  ✓ Column renamed successfully!');
    }
    
    // Re-add all foreign keys with updated column names
    console.log('\n🔄 Re-adding foreign keys...');
    
    for (const fk of allFks) {
      try {
        let column = fk.COLUMN_NAME;
        let refColumn = fk.REFERENCED_COLUMN_NAME;
        
        // Update column names
        if (column === 'message_id') column = 'communication_id';
        if (column === 'reply_to_message_id') column = 'reply_to_communication_id';
        if (refColumn === 'message_id') refColumn = 'communication_id';
        
        const refTable = fk.REFERENCED_TABLE_NAME || fk.TABLE_NAME;
        const action = column.includes('reply') || column.includes('sender') ? 'SET NULL' : 'CASCADE';
        
        await connection.execute(`
          ALTER TABLE ${fk.TABLE_NAME}
          ADD CONSTRAINT ${fk.CONSTRAINT_NAME}
          FOREIGN KEY (${column}) REFERENCES ${refTable}(${refColumn})
          ON DELETE ${action}
        `);
        console.log(`  ✓ Re-added ${fk.CONSTRAINT_NAME} to ${fk.TABLE_NAME}`);
      } catch (err) {
        console.log(`  ⚠ ${fk.CONSTRAINT_NAME}: ${err.message}`);
      }
    }
    
    // Show final structure
    console.log('\n📋 Final table structure:');
    const [finalCols] = await connection.execute('DESCRIBE team_mentor_communications');
    
    finalCols.forEach(col => {
      const key = col.Key === 'PRI' ? ' [PRIMARY KEY]' : col.Key === 'MUL' ? ' [FK]' : '';
      console.log(`  - ${col.Field} (${col.Type})${key}`);
    });
    
    console.log('\n✅ Successfully renamed message_id → communication_id!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

renamePrimaryKey()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
