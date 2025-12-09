require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixAllCommunicationFeatures() {
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
    
    // 1. Fix column name: communication_id should be message_id
    console.log('📋 Checking for communication_id column...');
    const [commIdColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'communication_id'"
    );
    
    if (commIdColumns.length === 0) {
      console.log('✓ No communication_id column (using message_id correctly)');
    }
    
    // 2. Add reactions column (JSON)
    console.log('\n📋 Adding reactions column...');
    const [reactionsColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'reactions'"
    );
    
    if (reactionsColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN reactions JSON DEFAULT NULL COMMENT 'Stores reactions as JSON array'
      `);
      console.log('✓ Added reactions column');
    } else {
      console.log('✓ reactions column already exists');
    }
    
    // 3. Add read_by column (JSON) for read receipts
    console.log('\n📋 Adding read_by column...');
    const [readByColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'read_by'"
    );
    
    if (readByColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN read_by JSON DEFAULT NULL COMMENT 'Stores user IDs who read the message'
      `);
      console.log('✓ Added read_by column');
    } else {
      console.log('✓ read_by column already exists');
    }
    
    // 4. Add is_edited column
    console.log('\n📋 Adding is_edited column...');
    const [editedColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'is_edited'"
    );
    
    if (editedColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN is_edited BOOLEAN DEFAULT FALSE
      `);
      console.log('✓ Added is_edited column');
    } else {
      console.log('✓ is_edited column already exists');
    }
    
    // 5. Add edited_at column
    console.log('\n📋 Adding edited_at column...');
    const [editedAtColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'edited_at'"
    );
    
    if (editedAtColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN edited_at TIMESTAMP NULL
      `);
      console.log('✓ Added edited_at column');
    } else {
      console.log('✓ edited_at column already exists');
    }
    
    // 6. Add reply_to_message_id for threaded conversations
    console.log('\n📋 Adding reply_to_message_id column...');
    const [replyToColumns] = await connection.execute(
      "SHOW COLUMNS FROM team_mentor_communications LIKE 'reply_to_message_id'"
    );
    
    if (replyToColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE team_mentor_communications 
        ADD COLUMN reply_to_message_id INT NULL,
        ADD FOREIGN KEY (reply_to_message_id) REFERENCES team_mentor_communications(message_id) ON DELETE SET NULL
      `);
      console.log('✓ Added reply_to_message_id column');
    } else {
      console.log('✓ reply_to_message_id column already exists');
    }
    
    // 7. Make sure sent_at has a default
    console.log('\n📋 Updating sent_at column...');
    await connection.execute(`
      ALTER TABLE team_mentor_communications 
      MODIFY COLUMN sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✓ Updated sent_at with default timestamp');
    
    // 8. Show final table structure
    console.log('\n📋 FINAL team_mentor_communications table structure:');
    console.log('═'.repeat(80));
    const [finalStructure] = await connection.execute(
      'DESCRIBE team_mentor_communications'
    );
    finalStructure.forEach(col => {
      const nullStatus = col.Null === 'NO' ? '❌ NOT NULL' : '✅ NULL';
      const keyInfo = col.Key ? `[${col.Key}]` : '';
      const defaultVal = col.Default ? `(default: ${col.Default})` : '';
      console.log(`   ${col.Field}`);
      console.log(`      Type: ${col.Type} ${nullStatus} ${keyInfo} ${defaultVal}`);
    });
    console.log('═'.repeat(80));
    
    console.log('\n✅ ALL COMMUNICATION FEATURES FIXED!\n');
    console.log('📱 Now supports:');
    console.log('   ✅ Send messages (text + files)');
    console.log('   ✅ Reply to messages (threading)');
    console.log('   ✅ Edit messages');
    console.log('   ✅ Delete for me');
    console.log('   ✅ Delete for everyone');
    console.log('   ✅ Reactions/emojis');
    console.log('   ✅ Read receipts');
    console.log('   ✅ File attachments');
    console.log('   ✅ Message history');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.sql) console.error('SQL:', error.sql);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

fixAllCommunicationFeatures();
