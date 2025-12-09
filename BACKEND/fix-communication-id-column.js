const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCommunicationIdColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hackathon_db',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('✓ Database connected successfully\n');
    
    // 1. Check current primary key column name
    console.log('📋 Checking current primary key column...');
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications WHERE `Key` = 'PRI'"
    );
    
    console.log('Current primary key:', columns[0].Field);
    
    if (columns[0].Field === 'message_id') {
      console.log('\n🔄 Renaming message_id to communication_id...\n');
      
      // Step 1: Drop all foreign key constraints referencing message_id
      console.log('Step 1: Dropping foreign key constraints...');
      const [fks] = await connection.execute(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'hackathon_db' 
        AND TABLE_NAME = 'team_mentor_communications'
      `);
      
      for (const fk of fks) {
        if (fk.CONSTRAINT_NAME !== 'PRIMARY') {
          try {
            await connection.execute(
              `ALTER TABLE team_mentor_communications DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
            );
            console.log(`  ✓ Dropped foreign key: ${fk.CONSTRAINT_NAME}`);
          } catch (err) {
            console.log(`  ⚠ Could not drop ${fk.CONSTRAINT_NAME}: ${err.message}`);
          }
        }
      }
      
      // Step 2: Drop any foreign keys from other tables referencing this column
      console.log('\nStep 2: Checking for references from other tables...');
      const [refFks] = await connection.execute(`
        SELECT TABLE_NAME, CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'hackathon_db' 
        AND REFERENCED_TABLE_NAME = 'team_mentor_communications'
        AND REFERENCED_COLUMN_NAME = 'message_id'
      `);
      
      for (const fk of refFks) {
        await connection.execute(
          `ALTER TABLE ${fk.TABLE_NAME} DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
        console.log(`  ✓ Dropped foreign key from ${fk.TABLE_NAME}: ${fk.CONSTRAINT_NAME}`);
      }
      
      // Step 3: Remove AUTO_INCREMENT first
      console.log('\nStep 3: Removing AUTO_INCREMENT...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        MODIFY message_id INT(11) NOT NULL
      `);
      console.log('  ✓ AUTO_INCREMENT removed');
      
      // Step 4: Drop the primary key
      console.log('\nStep 4: Dropping primary key...');
      await connection.execute(
        'ALTER TABLE team_mentor_communications DROP PRIMARY KEY'
      );
      console.log('  ✓ Primary key dropped');
      
      // Step 5: Rename the column
      console.log('\nStep 5: Renaming column message_id to communication_id...');
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        CHANGE COLUMN message_id communication_id INT(11) NOT NULL AUTO_INCREMENT
      `);
      console.log('  ✓ Column renamed to communication_id');
      
      // Step 6: Re-add primary key
      console.log('\nStep 6: Re-adding primary key...');
      await connection.execute(
        'ALTER TABLE team_mentor_communications ADD PRIMARY KEY (communication_id)'
      );
      console.log('  ✓ Primary key re-added');
      
      // Step 7: Re-add foreign keys
      console.log('\nStep 7: Re-adding foreign key constraints...');
      
      // Add back the foreign keys we dropped
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_team 
        FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
      `);
      console.log('  ✓ Added foreign key: fk_tmc_team');
      
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_mentor 
        FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE
      `);
      console.log('  ✓ Added foreign key: fk_tmc_mentor');
      
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD CONSTRAINT fk_tmc_sender 
        FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
      `);
      console.log('  ✓ Added foreign key: fk_tmc_sender');
      
      // Check if reply_to_message_id exists and re-add its FK
      const [replyCol] = await connection.execute(
        "SHOW COLUMNS FROM team_mentor_communications LIKE 'reply_to_message_id'"
      );
      
      if (replyCol.length > 0) {
        // Rename the column first
        await connection.execute(`
          ALTER TABLE team_mentor_communications 
          CHANGE COLUMN reply_to_message_id reply_to_communication_id INT(11) NULL
        `);
        console.log('  ✓ Renamed reply_to_message_id to reply_to_communication_id');
        
        await connection.execute(`
          ALTER TABLE team_mentor_communications 
          ADD CONSTRAINT fk_tmc_reply 
          FOREIGN KEY (reply_to_communication_id) REFERENCES team_mentor_communications(communication_id) ON DELETE SET NULL
        `);
        console.log('  ✓ Added foreign key: fk_tmc_reply');
      }
      
      console.log('\n✅ ALL COLUMN NAMES FIXED!');
      console.log('   message_id → communication_id');
      console.log('   reply_to_message_id → reply_to_communication_id');
      
    } else if (columns[0].Field === 'communication_id') {
      console.log('✓ Column name is already communication_id - no changes needed!');
    }
    
    // Display final structure
    console.log('\n📋 FINAL team_mentor_communications table structure:');
    const [finalColumns] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    
    finalColumns.forEach(col => {
      const keyInfo = col.Key === 'PRI' ? ' [PRIMARY KEY]' : col.Key === 'MUL' ? ' [FOREIGN KEY]' : '';
      const nullInfo = col.Null === 'NO' ? ' NOT NULL' : ' NULL';
      const defaultInfo = col.Default !== null ? ` (default: ${col.Default})` : '';
      console.log(`- ${col.Field} (${col.Type})${nullInfo}${defaultInfo}${keyInfo}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

fixCommunicationIdColumn()
  .then(() => {
    console.log('\n✅ Database fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to fix database:', error);
    process.exit(1);
  });
